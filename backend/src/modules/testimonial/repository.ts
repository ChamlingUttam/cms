import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { TestimonialNotFoundError } from './service';
import type {
  TestimonialCreateInput,
  TestimonialInput,
  TestimonialRecord,
  TestimonialRepository,
} from './service';

export const testimonialRepository: TestimonialRepository = {
  findMany: () =>
    prisma.testimonial.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    }),

  findById: (id) =>
    prisma.testimonial.findUnique({
      where: { id },
    }),

  create: (input: TestimonialCreateInput) =>
    prisma.testimonial.create({
      data: input,
    }),

  async update(id: string, input: TestimonialInput) {
    try {
      return await prisma.testimonial.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new TestimonialNotFoundError();
      }

      throw error;
    }
  },

  async delete(id: string) {
    try {
      return await prisma.testimonial.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new TestimonialNotFoundError();
      }

      throw error;
    }
  },

  async restore(record: TestimonialRecord) {
    await prisma.testimonial.create({
      data: record,
    });
  },
};
