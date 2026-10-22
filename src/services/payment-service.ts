import * as donasiRepo from "@/repositories/donasi-repository";
import * as txRepo from "@/repositories/transaction-repository";
import {
  createMidtransSnapTransaction,
  verifyMidtransSignature,
  MIDTRANS_CONFIG,
} from "@/lib/midtrans";
import type {
  DonationCreateInput,
  PaymentInitiateResponse,
  MidtransNotificationPayload,
} from "@/types";

export async function initiateDonationPayment(
  input: DonationCreateInput
): Promise<PaymentInitiateResponse> {
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const orderId = `DON-${Date.now()}-${randomSuffix}`;

  // 1. Simpan Donation dan Transaction awal (status: pending)
  const { donation, transaction } = await donasiRepo.createDonationWithTransaction({
    donation: input,
    orderId,
  });

  let snapToken = "";
  let redirectUrl = "";

  // 2. Request snap token ke Midtrans Sandbox
  try {
    if (
      MIDTRANS_CONFIG.serverKey &&
      !MIDTRANS_CONFIG.serverKey.includes("placeholder")
    ) {
      const snapResponse = await createMidtransSnapTransaction({
        orderId,
        grossAmount: input.amount,
        donorName: input.donorName,
        donorEmail: input.donorEmail,
        isAnonymous: input.isAnonymous,
      });
      snapToken = snapResponse.token;
      redirectUrl = snapResponse.redirect_url;
    } else {
      // Fallback sandbox token simulasi jika key belum diset
      snapToken = `sandbox-token-${orderId}`;
      redirectUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snapToken}`;
    }

    // 3. Update snap token di record transaction
    await txRepo.updateTransactionSnapToken(orderId, snapToken);
  } catch (error) {
    console.error("[PaymentService] Gagal mendapatkan token Midtrans:", error);
    // Masih kembalikan data agar flow tidak putus total
    snapToken = `mock-token-${orderId}`;
    await txRepo.updateTransactionSnapToken(orderId, snapToken);
  }

  return {
    orderId,
    donationId: donation.id,
    snapToken,
    redirectUrl,
  };
}

export async function handleMidtransWebhook(payload: MidtransNotificationPayload) {
  const {
    order_id: orderId,
    status_code: statusCode,
    gross_amount: grossAmount,
    signature_key: signatureKey,
    transaction_status: transactionStatus,
    fraud_status: fraudStatus,
    payment_type: paymentType,
    transaction_time: transactionTime,
  } = payload;

  // Verifikasi keaslian webhook dari Midtrans
  const isValidSignature = verifyMidtransSignature({
    orderId,
    statusCode,
    grossAmount,
    signatureKey,
  });

  if (!isValidSignature && !MIDTRANS_CONFIG.serverKey.includes("placeholder")) {
    throw new Error("Invalid Midtrans signature key");
  }

  let finalStatus = "pending";
  let shouldVerifyDonation = false;

  if (transactionStatus === "capture") {
    if (fraudStatus === "accept") {
      finalStatus = "settlement";
      shouldVerifyDonation = true;
    } else if (fraudStatus === "challenge") {
      finalStatus = "challenge";
    }
  } else if (transactionStatus === "settlement") {
    finalStatus = "settlement";
    shouldVerifyDonation = true;
  } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
    finalStatus = transactionStatus;
    shouldVerifyDonation = false;
  } else if (transactionStatus === "pending") {
    finalStatus = "pending";
    shouldVerifyDonation = false;
  }

  // Update status transaksi
  const updatedTx = await txRepo.updateTransactionStatus(orderId, {
    status: finalStatus,
    paymentType,
    transactionTime: transactionTime ? new Date(transactionTime) : new Date(),
    rawResponse: JSON.stringify(payload),
  });

  // Update status verifikasi donasi jika sukses
  if (shouldVerifyDonation && updatedTx.donationId) {
    await donasiRepo.markDonationVerified(updatedTx.donationId, true);
  }

  return { orderId, status: finalStatus, verified: shouldVerifyDonation };
}
