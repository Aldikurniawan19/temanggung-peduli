import { prisma } from "@/lib/prisma";
import type { PrayerCreateInput } from "@/types";

export async function createPrayer(data: PrayerCreateInput) {
  return await prisma.prayer.create({
    data: {
      name: data.name,
      message: data.message,
      isApproved: true, // Direct approval so prayers are immediately saved & displayed in Supabase
    },
    select: {
      id: true,
      name: true,
      message: true,
      isApproved: true,
      createdAt: true,
    },
  });
}

export async function findApprovedPrayers(limit = 12, cursor?: string) {
  return await prisma.prayer.findMany({
    where: { isApproved: true },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      message: true,
      createdAt: true,
    },
  });
}

export async function getPrayersForAdmin(limit = 20, offset = 0, isApproved?: boolean) {
  const where = isApproved !== undefined ? { isApproved } : {};
  const [prayers, total] = await Promise.all([
    prisma.prayer.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    }),
    prisma.prayer.count({ where }),
  ]);

  return { prayers, total };
}

export async function updatePrayerApproval(id: string, isApproved: boolean) {
  return await prisma.prayer.update({
    where: { id },
    data: { isApproved },
    select: {
      id: true,
      name: true,
      isApproved: true,
    },
  });
}

export async function deletePrayer(id: string) {
  return await prisma.prayer.delete({
    where: { id },
    select: { id: true },
  });
}

export async function approveAllPendingPrayers() {
  return await prisma.prayer.updateMany({
    where: { isApproved: false },
    data: { isApproved: true },
  });
}

