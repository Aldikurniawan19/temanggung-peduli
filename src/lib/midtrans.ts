import crypto from "crypto";

export const MIDTRANS_CONFIG = {
  serverKey: process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-placeholder",
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || process.env.MIDTRANS_CLIENT_KEY || "SB-Mid-client-placeholder",
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
};

export function getSnapScriptUrl(): string {
  return MIDTRANS_CONFIG.isProduction
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";
}

export function getSnapApiUrl(): string {
  return MIDTRANS_CONFIG.isProduction
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";
}

export interface SnapTransactionPayload {
  orderId: string;
  grossAmount: number;
  donorName: string;
  donorEmail?: string;
  isAnonymous?: boolean;
}

export interface SnapResponse {
  token: string;
  redirect_url: string;
}

export async function createMidtransSnapTransaction(
  payload: SnapTransactionPayload
): Promise<SnapResponse> {
  const authString = Buffer.from(`${MIDTRANS_CONFIG.serverKey}:`).toString("base64");

  const requestBody = {
    transaction_details: {
      order_id: payload.orderId,
      gross_amount: payload.grossAmount,
    },
    item_details: [
      {
        id: "DONASI-KARHUTLA",
        price: payload.grossAmount,
        quantity: 1,
        name: "Donasi Penanganan Karhutla Temanggung",
      },
    ],
    customer_details: {
      first_name: payload.isAnonymous ? "Hamba" : payload.donorName,
      last_name: payload.isAnonymous ? "Allah" : "",
      email: payload.donorEmail || undefined,
    },
  };

  const response = await fetch(getSnapApiUrl(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Midtrans API error (${response.status}): ${errorText}`);
  }

  return (await response.json()) as SnapResponse;
}

export function verifyMidtransSignature(params: {
  orderId: string;
  statusCode: string;
  grossAmount: string;
  signatureKey: string;
}): boolean {
  const hashInput = `${params.orderId}${params.statusCode}${params.grossAmount}${MIDTRANS_CONFIG.serverKey}`;
  const computedHash = crypto
    .createHash("sha512")
    .update(hashInput)
    .digest("hex");

  return computedHash.toLowerCase() === params.signatureKey.toLowerCase();
}
