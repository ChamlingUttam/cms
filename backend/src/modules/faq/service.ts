import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

type FaqInput = {
  question?: string;
  answer?: string;
};

export class FaqNotFoundError extends Error {}

export async function getFaqRecords(options: { publicOnly: boolean }) {
  if (options.publicOnly) {
    return prisma.fAQ.findMany({
      select: { id: true, question: true, answer: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  return prisma.fAQ.findMany({
    orderBy: { createdAt: 'asc' },
  });
}

export async function getFaqRecord(id: string) {
  const faq = await prisma.fAQ.findUnique({ where: { id } });

  if (!faq) {
    throw new FaqNotFoundError();
  }

  return faq;
}

export async function createFaqRecord(faq: Required<FaqInput>) {
  return prisma.fAQ.create({ data: faq });
}

export async function updateFaqRecord(id: string, faq: FaqInput) {
  try {
    return await prisma.fAQ.update({
      where: { id },
      data: faq,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new FaqNotFoundError();
    }

    throw error;
  }
}

export async function deleteFaqRecord(id: string) {
  try {
    return await prisma.fAQ.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new FaqNotFoundError();
    }

    throw error;
  }
}
