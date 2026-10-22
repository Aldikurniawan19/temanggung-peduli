import { prisma } from "@/lib/prisma";

export async function findTransactionByOrderId(orderId: string) {
  return await prisma.transaction.findUnique({
    where: { orderId },
    include: {
      donation: true,
    },
  });
}

export async function updateTransactionSnapToken(orderId: string, snapToken: string) {
  return await prisma.transaction.update({
    where: { orderId },
    data: { snapToken },
    select: {
      id: true,
      orderId: true,
      snapToken: true,
      status: true,
    },
  });
}

export interface UpdateTransactionStatusParams {
  status: string;
  paymentType?: string | null;
  transactionTime?: Date | null;
  rawResponse?: string;
}

export async function updateTransactionStatus(
  orderId: string,
  params: UpdateTransactionStatusParams
) {
  return await prisma.transaction.update({
    where: { orderId },
    data: {
      status: params.status,
      paymentType: params.paymentType,
      transactionTime: params.transactionTime,
      rawResponse: params.rawResponse,
    },
    include: {
      donation: true,
    },
  });
}
