import * as ucapanRepo from "@/repositories/ucapan-repository";
import type { PrayerCreateInput, PrayerPublic } from "@/types";

export async function submitPrayer(data: PrayerCreateInput) {
  return await ucapanRepo.createPrayer(data);
}

export async function getPublicPrayers(
  limit = 12,
  cursor?: string
): Promise<PrayerPublic[]> {
  const prayers = await ucapanRepo.findApprovedPrayers(limit, cursor);

  return prayers.map((p) => ({
    id: p.id,
    name: p.name,
    message: p.message,
    createdAt: p.createdAt.toISOString(),
  }));
}

export async function getAdminPrayerList(
  limit = 20,
  offset = 0,
  isApproved?: boolean
) {
  return await ucapanRepo.getPrayersForAdmin(limit, offset, isApproved);
}

export async function setPrayerStatus(id: string, isApproved: boolean) {
  return await ucapanRepo.updatePrayerApproval(id, isApproved);
}

export async function deletePrayerById(id: string) {
  return await ucapanRepo.deletePrayer(id);
}

export async function approveAllPendingPrayers() {
  return await ucapanRepo.approveAllPendingPrayers();
}

