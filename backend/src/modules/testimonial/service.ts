import { randomUUID } from 'node:crypto';

export type TestimonialRecord = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  profession: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TestimonialInput = {
  name?: string;
  description?: string;
  profession?: string | null;
  imageUrl?: string | null;
};

export type TestimonialCreateInput = {
  name: string;
  description: string;
  profession?: string | null;
  imageUrl?: string | null;
};

export type TestimonialRepository = {
  findMany: () => Promise<TestimonialRecord[]>;
  findById: (id: string) => Promise<TestimonialRecord | null>;
  create: (input: TestimonialCreateInput) => Promise<TestimonialRecord>;
  update: (id: string, input: TestimonialInput) => Promise<TestimonialRecord>;
  delete: (id: string) => Promise<TestimonialRecord>;
  restore: (record: TestimonialRecord) => Promise<void>;
};

export type TestimonialStorage = {
  upload: (
    filePath: string,
    publicId: string,
  ) => Promise<{ imageUrl: string; publicId: string }>;
  delete: (publicId: string) => Promise<void>;
};

export class TestimonialNotFoundError extends Error {}

export function getTestimonialPublicId(imageUrl: string) {
  const parsedUrl = new URL(imageUrl);
  const uploadMarker = '/image/upload/';
  const uploadIndex = parsedUrl.pathname.indexOf(uploadMarker);

  if (parsedUrl.hostname !== 'res.cloudinary.com' || uploadIndex === -1) {
    throw new Error('Stored testimonial image URL is not a Cloudinary URL.');
  }

  const pathAfterUpload = parsedUrl.pathname.slice(
    uploadIndex + uploadMarker.length,
  );
  const pathSegments = pathAfterUpload.split('/').filter(Boolean);
  const versionIndex = pathSegments.findIndex((segment) =>
    /^v\d+$/.test(segment),
  );

  if (versionIndex !== -1) {
    pathSegments.splice(0, versionIndex + 1);
  } else {
    while (
      pathSegments.length > 0 &&
      /^(?:f_[a-z0-9_,.-]+|q_[a-z0-9_,.-]+|w_\d+|h_\d+|c_[a-z0-9_-]+)$/.test(
        pathSegments[0],
      )
    ) {
      pathSegments.shift();
    }
  }

  const lastSegmentIndex = pathSegments.length - 1;
  const filename = pathSegments[lastSegmentIndex];

  if (!filename) {
    throw new Error(
      'Stored testimonial image URL has no Cloudinary public ID.',
    );
  }

  pathSegments[lastSegmentIndex] = filename.replace(/\.[^.]+$/, '');

  return pathSegments.join('/');
}

export function createTestimonialService(
  repository: TestimonialRepository,
  storage: TestimonialStorage,
) {
  async function uploadImage(filePath: string) {
    const publicId = `testimonials/${randomUUID()}`;

    try {
      return await storage.upload(filePath, publicId);
    } catch (error) {
      try {
        await storage.delete(publicId);
      } catch (cleanupError) {
        console.error(
          'Testimonial image upload and Cloudinary cleanup failed.',
          error,
          cleanupError,
        );
      }

      throw error;
    }
  }

  async function cleanupNewImage(image: {
    publicId: string;
    imageUrl: string;
  }) {
    try {
      await storage.delete(image.publicId);
    } catch (error) {
      console.error(
        'Failed to clean up an unreferenced testimonial image.',
        image.publicId,
        error,
      );
    }
  }

  async function rollbackImageUpdate(
    id: string,
    previousImageUrl: string | null,
    newImage: { publicId: string; imageUrl: string } | undefined,
    cause: unknown,
  ) {
    try {
      await repository.update(id, { imageUrl: previousImageUrl });
    } catch (rollbackError) {
      console.error(
        'Failed to restore testimonial image URL after Cloudinary cleanup failure.',
        cause,
        rollbackError,
      );
      throw new Error(
        'Testimonial image update could not be completed safely.',
      );
    }

    if (newImage) {
      await cleanupNewImage(newImage);
    }

    throw new Error('The previous testimonial image could not be removed.');
  }

  return {
    async list() {
      return repository.findMany();
    },

    async create(
      input: TestimonialCreateInput,
      filePath?: string,
    ): Promise<TestimonialRecord> {
      const image = filePath ? await uploadImage(filePath) : undefined;

      try {
        return await repository.create({
          ...input,
          ...(image ? { imageUrl: image.imageUrl } : {}),
        });
      } catch (error) {
        if (image) {
          await cleanupNewImage(image);
        }

        throw error;
      }
    },

    async update(
      id: string,
      input: TestimonialInput,
      options: { filePath?: string; removeImage?: boolean },
    ): Promise<TestimonialRecord> {
      const existing = await repository.findById(id);

      if (!existing) {
        throw new TestimonialNotFoundError();
      }

      const newImage = options.filePath
        ? await uploadImage(options.filePath)
        : undefined;
      const imageIsChanging = Boolean(newImage || options.removeImage);
      const nextImageUrl = newImage
        ? newImage.imageUrl
        : options.removeImage
          ? null
          : undefined;
      const updateInput = {
        ...input,
        ...(imageIsChanging ? { imageUrl: nextImageUrl } : {}),
      };

      let updated: TestimonialRecord;

      try {
        updated = await repository.update(id, updateInput);
      } catch (error) {
        if (newImage) {
          await cleanupNewImage(newImage);
        }

        throw error;
      }

      if (imageIsChanging && existing.imageUrl) {
        let previousPublicId: string;

        try {
          previousPublicId = getTestimonialPublicId(existing.imageUrl);
          await storage.delete(previousPublicId);
        } catch (error) {
          await rollbackImageUpdate(id, existing.imageUrl, newImage, error);
        }
      }

      return updated;
    },

    async delete(id: string): Promise<void> {
      const existing = await repository.findById(id);

      if (!existing) {
        throw new TestimonialNotFoundError();
      }

      const deleted = await repository.delete(id);

      if (existing.imageUrl) {
        try {
          await storage.delete(getTestimonialPublicId(existing.imageUrl));
        } catch (error) {
          try {
            await repository.restore(deleted);
          } catch (restoreError) {
            console.error(
              'Testimonial deletion cleanup failed and the database record could not be restored.',
              error,
              restoreError,
            );
            throw new Error(
              'Testimonial deletion could not be completed safely.',
            );
          }

          throw new Error('Testimonial image could not be removed.');
        }
      }
    },
  };
}

export type TestimonialService = ReturnType<typeof createTestimonialService>;
