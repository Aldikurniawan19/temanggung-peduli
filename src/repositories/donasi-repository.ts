import { prisma } from "@/lib/prisma";
import type { DonationCreateInput } from "@/types";

export interface CreateDonationTransactionParams {
  donation: DonationCreateInput;
  orderId: string;
}

export async function createDonationWithTransaction(params: CreateDonationTransactionParams) {
  return await prisma.$transaction(async (tx) => {
    const donation = await tx.donation.create({
      data: {
        donorName: params.donation.donorName,
        donorEmail: params.donation.donorEmail || null,
        isAnonymous: params.donation.isAnonymous ?? false,
        amount: params.donation.amount,
        message: params.donation.message || null,
        isVerified: false,
      },
      select: {
        id: true,
        donorName: true,
        donorEmail: true,
        isAnonymous: true,
        amount: true,
        message: true,
        isVerified: true,
        createdAt: true,
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        orderId: params.orderId,
        donationId: donation.id,
        grossAmount: params.donation.amount,
        status: "pending",
      },
      select: {
        id: true,
        orderId: true,
        donationId: true,
        status: true,
        grossAmount: true,
      },
    });

    return { donation, transaction };
  });
}

export async function createDirectVerifiedDonation(params: CreateDonationTransactionParams) {
  return await prisma.$transaction(async (tx) => {
    const donation = await tx.donation.create({
      data: {
        donorName: params.donation.donorName,
        donorEmail: params.donation.donorEmail || null,
        isAnonymous: params.donation.isAnonymous ?? false,
        amount: params.donation.amount,
        message: params.donation.message || null,
        isVerified: true,
      },
      select: {
        id: true,
        donorName: true,
        donorEmail: true,
        isAnonymous: true,
        amount: true,
        message: true,
        isVerified: true,
        createdAt: true,
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        orderId: params.orderId,
        donationId: donation.id,
        grossAmount: params.donation.amount,
        status: "settlement",
        paymentType: "direct_supabase",
        transactionTime: new Date(),
      },
      select: {
        id: true,
        orderId: true,
        donationId: true,
        status: true,
        grossAmount: true,
      },
    });

    return { donation, transaction };
  });
}

export async function findVerifiedDonations(limit = 10, cursor?: string) {
  return await prisma.donation.findMany({
    where: { isVerified: true },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      donorName: true,
      isAnonymous: true,
      amount: true,
      message: true,
      createdAt: true,
    },
  });
}

export async function getDonationStats() {
  const [aggregates, donorCount] = await Promise.all([
    prisma.donation.aggregate({
      where: { isVerified: true },
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.donation.count({
      where: { isVerified: true },
    }),
  ]);

  return {
    totalAmount: aggregates._sum.amount ?? 0,
    donorCount,
    verifiedCount: aggregates._count.id ?? 0,
  };
}

export async function findDonationById(id: string) {
  return await prisma.donation.findUnique({
    where: { id },
    include: { transaction: true },
  });
}

export async function markDonationVerified(id: string, isVerified = true) {
  return await prisma.donation.update({
    where: { id },
    data: { isVerified },
    select: {
      id: true,
      isVerified: true,
      amount: true,
      donorName: true,
    },
  });
}

export async function getAllDonationsForAdmin(limit = 20, offset = 0) {
  const [donations, total] = await Promise.all([
    prisma.donation.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        transaction: {
          select: {
            orderId: true,
            status: true,
            paymentType: true,
            transactionTime: true,
          },
        },
      },
    }),
    prisma.donation.count(),
  ]);

  return { donations, total };
}
