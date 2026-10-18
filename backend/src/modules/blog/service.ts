import { randomUUID } from 'node:crypto';

export type BlogRecord = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogInput = {
  name?: string;
  slug?: string;
  shortDescription?: string;
  longDescription?: string;
  imageUrl?: string | null;
};

export type BlogCreateInput = {
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  imageUrl?: string | null;
};

export type BlogRepository = {
  findMany: (options: { skip: number; take: number }) => Promise<BlogRecord[]>;
  count: () => Promise<number>;
  findById: (id: string) => Promise<BlogRecord | null>;
  findBySlug: (slug: string) => Promise<BlogRecord | null>;
  create: (input: BlogCreateInput) => Promise<BlogRecord>;
  update: (id: string, input: BlogInput) => Promise<BlogRecord>;
  delete: (id: string) => Promise<BlogRecord>;
  restore: (record: BlogRecord) => Promise<void>;
};

export type BlogStorage = {
  upload: (
    filePath: string,
    publicId: string,
  ) => Promise<{ imageUrl: string; publicId: string }>;
  delete: (publicId: string) => Promise<void>;
};

export class BlogNotFoundError extends Error {}
export class BlogSlugConflictError extends Error {}

export function slugify(value: string) {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 220)
    .replace(/-+$/g, '');

  return slug || 'blog';
}

export function getBlogPublicId(imageUrl: string) {
  const parsedUrl = new URL(imageUrl);
  const uploadMarker = '/image/upload/';
  const uploadIndex = parsedUrl.pathname.indexOf(uploadMarker);

  if (parsedUrl.hostname !== 'res.cloudinary.com' || uploadIndex === -1) {
    throw new Error('Stored blog image URL is not a Cloudinary URL.');
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
    throw new Error('Stored blog image URL has no Cloudinary public ID.');
  }

  pathSegments[lastSegmentIndex] = filename.replace(/\.[^.]+$/, '');
  return pathSegments.join('/');
}

export function createBlogService(
  repository: BlogRepository,
  storage: BlogStorage,
) {
  async function cleanupImage(image: { imageUrl: string; publicId: string }) {
    try {
      await storage.delete(image.publicId);
    } catch (error) {
      console.error('Failed to clean up an unreferenced blog image.', error);
    }
  }

  async function uploadImage(filePath: string) {
    const publicId = `blogs/${randomUUID()}`;

    try {
      return await storage.upload(filePath, publicId);
    } catch (error) {
      try {
        await storage.delete(publicId);
      } catch (cleanupError) {
        console.error(
          'Blog image upload and Cloudinary cleanup failed.',
          error,
          cleanupError,
        );
      }

      throw error;
    }
  }

  async function findAvailableSlug(name: string, existingId?: string) {
    const baseSlug = slugify(name);

    for (let suffix = 1; suffix <= 1000; suffix += 1) {
      const candidate =
        suffix === 1
          ? baseSlug
          : `${baseSlug.slice(0, 220 - String(suffix).length - 1)}-${suffix}`;
      const existing = await repository.findBySlug(candidate);

      if (!existing || existing.id === existingId) {
        return candidate;
      }
    }

    throw new Error('Could not generate a unique blog slug.');
  }

  async function createWithUniqueSlug(input: Omit<BlogCreateInput, 'slug'>) {
    for (let attempt = 0; attempt < 1000; attempt += 1) {
      const slug = await findAvailableSlug(input.name);

      try {
        return await repository.create({ ...input, slug });
      } catch (error) {
        if (!(error instanceof BlogSlugConflictError)) {
          throw error;
        }
      }
    }

    throw new Error('Could not create a blog with a unique slug.');
  }

  async function updateWithUniqueSlug(
    id: string,
    input: BlogInput,
    name: string | undefined,
  ) {
    if (name === undefined) {
      return repository.update(id, input);
    }

    for (let attempt = 0; attempt < 1000; attempt += 1) {
      const slug = await findAvailableSlug(name, id);

      try {
        return await repository.update(id, { ...input, slug });
      } catch (error) {
        if (!(error instanceof BlogSlugConflictError)) {
          throw error;
        }
      }
    }

    throw new Error('Could not generate a unique blog slug.');
  }

  async function replaceImageOnRecord(
    id: string,
    existing: BlogRecord,
    input: BlogInput,
    nameForSlug: string | undefined,
    newImage: { imageUrl: string; publicId: string } | undefined,
    removeImage: boolean,
  ) {
    const nextImageUrl = newImage
      ? newImage.imageUrl
      : removeImage
        ? null
        : undefined;

    let updated: BlogRecord;

    try {
      updated = await updateWithUniqueSlug(
        id,
        {
          ...input,
          ...(newImage || removeImage ? { imageUrl: nextImageUrl } : {}),
        },
        nameForSlug,
      );
    } catch (error) {
      if (newImage) {
        await cleanupImage(newImage);
      }
      throw error;
    }

    if (existing.imageUrl) {
      try {
        await storage.delete(getBlogPublicId(existing.imageUrl));
      } catch (error) {
        try {
          await repository.update(id, { imageUrl: existing.imageUrl });
        } catch (rollbackError) {
          console.error(
            'Failed to restore blog image URL after Cloudinary cleanup failure.',
            error,
            rollbackError,
          );
          throw new Error('Blog image update could not be completed safely.');
        }

        if (newImage) {
          await cleanupImage(newImage);
        }

        throw new Error('The previous blog image could not be removed.');
      }
    }

    return updated;
  }

  return {
    async listAdmin(page: number, limit: number) {
      const skip = (page - 1) * limit;
      const [blogs, totalItems] = await Promise.all([
        repository.findMany({ skip, take: limit }),
        repository.count(),
      ]);

      return {
        blogs,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      };
    },

    async listPublic(page: number, limit: number) {
      const skip = (page - 1) * limit;
      const [blogs, totalItems] = await Promise.all([
        repository.findMany({ skip, take: limit }),
        repository.count(),
      ]);

      return {
        blogs,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      };
    },

    async getById(id: string) {
      const blog = await repository.findById(id);
      if (!blog) {
        throw new BlogNotFoundError();
      }
      return blog;
    },

    async getBySlug(slug: string) {
      const blog = await repository.findBySlug(slug);
      if (!blog) {
        throw new BlogNotFoundError();
      }
      return blog;
    },

    async create(input: Omit<BlogCreateInput, 'slug'>, filePath?: string) {
      const image = filePath ? await uploadImage(filePath) : undefined;

      try {
        return await createWithUniqueSlug({
          ...input,
          ...(image ? { imageUrl: image.imageUrl } : {}),
        });
      } catch (error) {
        if (image) {
          await cleanupImage(image);
        }
        throw error;
      }
    },

    async update(
      id: string,
      input: Omit<BlogInput, 'slug' | 'imageUrl'>,
      options: { filePath?: string; removeImage?: boolean },
    ) {
      const existing = await repository.findById(id);
      if (!existing) {
        throw new BlogNotFoundError();
      }

      const newImage = options.filePath
        ? await uploadImage(options.filePath)
        : undefined;
      const nameForSlug =
        input.name !== undefined && input.name !== existing.name
          ? input.name
          : undefined;
      const contentInput = { ...input };

      if (newImage || options.removeImage) {
        return replaceImageOnRecord(
          id,
          existing,
          contentInput,
          nameForSlug,
          newImage,
          Boolean(options.removeImage),
        );
      }

      return updateWithUniqueSlug(id, contentInput, nameForSlug);
    },

    async delete(id: string) {
      const existing = await repository.findById(id);
      if (!existing) {
        throw new BlogNotFoundError();
      }

      const deleted = await repository.delete(id);

      if (existing.imageUrl) {
        try {
          await storage.delete(getBlogPublicId(existing.imageUrl));
        } catch (error) {
          try {
            await repository.restore(deleted);
          } catch (restoreError) {
            console.error(
              'Blog deletion failed and the database record could not be restored.',
              error,
              restoreError,
            );
            throw new Error('Blog deletion could not be completed safely.');
          }

          throw new Error('Blog image could not be removed.');
        }
      }
    },
  };
}

export type BlogService = ReturnType<typeof createBlogService>;
