import * as donasiRepo from "@/repositories/donasi-repository";
import type { DonationPublic, DonationStats } from "@/types";

export async function getPublicDonations(limit = 10, cursor?: string): Promise<DonationPublic[]> {
  const donations = await donasiRepo.findVerifiedDonations(limit, cursor);

  return donations.map((d) => ({
    id: d.id,
    displayName: d.isAnonymous ? "Hamba Allah" : d.donorName,
    amount: d.amount,
    message: d.message,
    createdAt: d.createdAt.toISOString(),
  }));
}

export async function getDonationSummaryStats(): Promise<DonationStats> {
  return await donasiRepo.getDonationStats();
}

export async function getAdminDonationList(limit = 20, offset = 0) {
  return await donasiRepo.getAllDonationsForAdmin(limit, offset);
}

export async function createDirectDonation(input: any) {
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const orderId = `DON-${Date.now()}-${randomSuffix}`;

  return await donasiRepo.createDirectVerifiedDonation({
    donation: input,
    orderId,
  });
}

