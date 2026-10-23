import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import {
  GalleryImageNotFoundError,
  type GalleryDateRange,
  type GalleryImageUpload,
  type GalleryRepository,
} from './service';

function getDateWhere(dateRange?: GalleryDateRange) {
  if (!dateRange) {
    return undefined;
  }

  return {
    createdAt: {
      ...(dateRange.from ? { gte: dateRange.from } : {}),
      ...(dateRange.to ? { lt: dateRange.to } : {}),
    },
  };
}

export const galleryRepository: GalleryRepository = {
  findMany: ({ skip, take, dateRange }) =>
    prisma.galleryImage.findMany({
      skip,
      take,
      where: getDateWhere(dateRange),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    }),

  count: (dateRange) =>
    prisma.galleryImage.count({
      where: getDateWhere(dateRange),
    }),

  findById: (id) =>
    prisma.galleryImage.findUnique({
      where: { id },
    }),

  create: (image: GalleryImageUpload) =>
    prisma.galleryImage.create({
      data: image,
    }),

  async delete(id) {
    try {
      return await prisma.galleryImage.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new GalleryImageNotFoundError();
      }

      throw error;
    }
  },
};
