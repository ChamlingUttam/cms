import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import {
  BlogNotFoundError,
  BlogSlugConflictError,
  type BlogCreateInput,
  type BlogInput,
  type BlogRecord,
  type BlogRepository,
} from './service';

function translatePrismaError(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    throw new BlogSlugConflictError();
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    throw new BlogNotFoundError();
  }

  throw error;
}

export const blogRepository: BlogRepository = {
  findMany: (options) =>
    prisma.blog.findMany({
      ...(options ? { skip: options.skip, take: options.take } : {}),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    }),

  count: () => prisma.blog.count(),

  findById: (id) =>
    prisma.blog.findUnique({
      where: { id },
    }),

  findBySlug: (slug) =>
    prisma.blog.findUnique({
      where: { slug },
    }),

  async create(input: BlogCreateInput) {
    try {
      return await prisma.blog.create({
        data: input,
      });
    } catch (error) {
      translatePrismaError(error);
    }
  },

  async update(id: string, input: BlogInput) {
    try {
      return await prisma.blog.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      translatePrismaError(error);
    }
  },

  async delete(id: string) {
    try {
      return await prisma.blog.delete({
        where: { id },
      });
    } catch (error) {
      translatePrismaError(error);
    }
  },

  async restore(record: BlogRecord) {
    await prisma.blog.create({
      data: record,
    });
  },
};
