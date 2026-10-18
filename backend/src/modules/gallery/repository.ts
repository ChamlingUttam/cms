import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import {
  GalleryImageNotFoundError,
  type GalleryImageUpload,
  type GalleryRepository,
} from './service';

export const galleryRepository: GalleryRepository = {
  findMany: ({ skip, take }) =>
    prisma.galleryImage.findMany({
      skip,
      take,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    }),

  count: () => prisma.galleryImage.count(),

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
