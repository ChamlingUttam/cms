import { randomUUID } from 'node:crypto';

export type GalleryImageRecord = {
  id: string;
  imageUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GalleryImageUpload = Omit<
  GalleryImageRecord,
  'id' | 'createdAt' | 'updatedAt'
>;

export type GalleryRepository = {
  findMany: (options: {
    skip: number;
    take: number;
  }) => Promise<GalleryImageRecord[]>;
  count: () => Promise<number>;
  findById: (id: string) => Promise<GalleryImageRecord | null>;
  create: (image: GalleryImageUpload) => Promise<GalleryImageRecord>;
  delete: (id: string) => Promise<GalleryImageRecord>;
};

export type GalleryStorage = {
  upload: (filePath: string, publicId: string) => Promise<GalleryImageUpload>;
  delete: (publicId: string) => Promise<void>;
};

export type GalleryUploadFile = {
  index: number;
  path: string;
  filename: string;
};

export type GalleryUploadResult =
  | {
      index: number;
      filename: string;
      success: true;
      image: GalleryImageRecord;
    }
  | {
      index: number;
      filename: string;
      success: false;
      message: string;
    };

export class GalleryImageNotFoundError extends Error {}


export function createGalleryService(
  repository: GalleryRepository,
  storage: GalleryStorage,
) {
  async function uploadOne(
    file: GalleryUploadFile,
  ): Promise<GalleryUploadResult> {
    const publicId = `gallery/${randomUUID()}`;
    let uploaded: GalleryImageUpload | undefined;

    try {
      uploaded = await storage.upload(file.path, publicId);
      const image = await repository.create(uploaded);
      return {
        index: file.index,
        filename: file.filename,
        success: true,
        image,
      };
    } catch (error) {
       console.error(
    'Gallery upload error (full):',
    JSON.stringify(error, Object.getOwnPropertyNames(error as object), 2),
  );
      try {
        await storage.delete(uploaded?.publicId ?? publicId);
      } catch (cleanupError) {
        console.error(
          'Gallery upload failed and Cloudinary cleanup could not be confirmed.',
          error,
          cleanupError,
        );
        return {
          index: file.index,
          filename: file.filename,
          success: false,
          message:
            'Upload failed and the stored image could not be cleaned up.',
        };
      }

      console.error('Gallery image upload failed.', error);
      return {
        index: file.index,
        filename: file.filename,
        success: false,
        message: 'Image could not be uploaded.',
      };
    }
  }

  return {
    async list(page: number, limit: number) {
      const skip = (page - 1) * limit;
      const [images, totalItems] = await Promise.all([
        repository.findMany({ skip, take: limit }),
        repository.count(),
      ]);

      return {
        images,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      };
    },

    async uploadMany(files: GalleryUploadFile[], concurrency = 3) {
      const results: GalleryUploadResult[] = new Array(files.length);
      let nextIndex = 0;
      const workerCount = Math.min(concurrency, files.length);

      await Promise.all(
        Array.from({ length: workerCount }, async () => {
          while (nextIndex < files.length) {
            const index = nextIndex;
            nextIndex += 1;
            results[index] = await uploadOne(files[index]);
          }
        }),
      );

      return results;
    },

    async delete(id: string) {
      const image = await repository.findById(id);

      if (!image) {
        throw new GalleryImageNotFoundError();
      }

      await storage.delete(image.publicId);
      await repository.delete(id);
    },
  };
}

export type GalleryService = ReturnType<typeof createGalleryService>;
