import { open, rm } from 'node:fs/promises';
import type { RequestHandler, Response } from 'express';
import { getImageDelivery } from '../gallery/delivery';
import {
  BlogNotFoundError,
  BlogSlugConflictError,
  type BlogRecord,
  type BlogService,
} from './service';

const pageSizeMaximum = 50;
const maximumOffset = 2_147_483_647;
const maxNameLength = 180;
const maxShortDescriptionLength = 500;
const maxLongDescriptionLength = 50_000;
const jpegSignature = Buffer.from([0xff, 0xd8, 0xff]);
const pngSignature = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

type BlogFields = {
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  removeImage?: boolean;
};

type CreateBlogFields = BlogFields & {
  name: string;
  shortDescription: string;
  longDescription: string;
};

function validateFields(
  body: unknown,
  isCreate: true,
  allowImageOnly?: boolean,
): { data: CreateBlogFields } | { error: string };
function validateFields(
  body: unknown,
  isCreate: false,
  allowImageOnly?: boolean,
): { data: BlogFields } | { error: string };
function validateFields(
  body: unknown,
  isCreate: boolean,
  allowImageOnly = false,
): { data: BlogFields } | { error: string } {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { error: 'The request body must be an object.' };
  }

  const input = body as Record<string, unknown>;
  const allowedFields = [
    'name',
    'shortDescription',
    'longDescription',
    'removeImage',
  ];

  if (Object.keys(input).some((key) => !allowedFields.includes(key))) {
    return {
      error:
        'Only name, shortDescription, longDescription, and removeImage are supported.',
    };
  }

  const requiredFields = [
    'name',
    'shortDescription',
    'longDescription',
  ] as const;

  if (
    isCreate &&
    requiredFields.some(
      (field) => !Object.prototype.hasOwnProperty.call(input, field),
    )
  ) {
    return {
      error: 'Name, shortDescription, and longDescription are required.',
    };
  }

  const data: BlogFields = {};
  const limits: Record<(typeof requiredFields)[number], number> = {
    name: maxNameLength,
    shortDescription: maxShortDescriptionLength,
    longDescription: maxLongDescriptionLength,
  };

  for (const field of requiredFields) {
    if (!Object.prototype.hasOwnProperty.call(input, field)) {
      continue;
    }

    const value = input[field];

    if (typeof value !== 'string' || value.trim().length === 0) {
      return { error: `${field} must be a non-empty string.` };
    }

    const normalized = value.trim();

    if (normalized.length > limits[field]) {
      return {
        error: `${field} must not exceed ${limits[field]} characters.`,
      };
    }

    data[field] = normalized;
  }

  if (Object.prototype.hasOwnProperty.call(input, 'removeImage')) {
    const value = input.removeImage;
    const removeImage =
      value === true || value === 'true'
        ? true
        : value === false || value === 'false'
          ? false
          : null;

    if (removeImage === null) {
      return { error: 'removeImage must be a boolean.' };
    }

    data.removeImage = removeImage;
  }

  if (isCreate && Object.prototype.hasOwnProperty.call(data, 'removeImage')) {
    return { error: 'removeImage is only supported when updating a blog.' };
  }

  if (!isCreate && !allowImageOnly && Object.keys(data).length === 0) {
    return { error: 'Provide at least one blog field to update.' };
  }

  if (
    !isCreate &&
    data.removeImage === false &&
    Object.keys(data).length === 1
  ) {
    return { error: 'Provide a field to update or set removeImage to true.' };
  }

  return { data };
}

function parsePositiveInteger(value: unknown, fallback: number) {
  if (value === undefined) {
    return { value: fallback };
  }

  if (
    typeof value !== 'string' ||
    !/^[1-9]\d*$/.test(value) ||
    !Number.isSafeInteger(Number(value))
  ) {
    return { error: 'Page and limit must be positive integers.' };
  }

  return { value: Number(value) };
}

function sendPaginationError(res: Response) {
  res.status(400).json({
    success: false,
    message:
      'Page must be a positive integer and limit must be between 1 and 50.',
  });
}

async function validateImage(file: Express.Multer.File) {
  const signature =
    file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'
      ? jpegSignature
      : file.mimetype === 'image/png'
        ? pngSignature
        : null;

  if (!signature) {
    return 'Only JPG, JPEG, and PNG images are allowed.';
  }

  const handle = await open(file.path, 'r');

  try {
    const header = Buffer.alloc(signature.length);
    const { bytesRead } = await handle.read(header, 0, signature.length, 0);

    if (bytesRead !== signature.length || !header.equals(signature)) {
      return 'The uploaded file content does not match its image type.';
    }
  } finally {
    await handle.close();
  }

  return null;
}

async function cleanupTemporaryFile(file: Express.Multer.File | undefined) {
  if (!file) {
    return;
  }

  try {
    await rm(file.path, { force: true });
  } catch (error) {
    console.error(
      'Failed to remove a temporary blog image file.',
      file.path,
      error,
    );
  }
}

function toResponse(blog: BlogRecord) {
  return {
    ...blog,
    ...(blog.imageUrl ? getImageDelivery(blog.imageUrl) : { srcSet: null }),
  };
}

function sendNotFound(res: Response) {
  res.status(404).json({ success: false, message: 'Blog not found.' });
}

export function createBlogController(service: BlogService) {
  const listAdminBlogs: RequestHandler = async (req, res) => {
    const pageResult = parsePositiveInteger(req.query.page, 1);
    const limitResult = parsePositiveInteger(req.query.limit, 20);

    if (
      'error' in pageResult ||
      'error' in limitResult ||
      limitResult.value > pageSizeMaximum ||
      (pageResult.value - 1) * limitResult.value > maximumOffset
    ) {
      sendPaginationError(res);
      return;
    }

    const result = await service.listAdmin(pageResult.value, limitResult.value);
    res.json({
      success: true,
      data: {
        blogs: result.blogs.map(toResponse),
        pagination: result.pagination,
      },
    });
  };

  const getAdminBlog: RequestHandler = async (req, res) => {
    const id = req.params.id;
    if (typeof id !== 'string' || id.length === 0) {
      res
        .status(400)
        .json({ success: false, message: 'A valid blog ID is required.' });
      return;
    }

    try {
      const blog = await service.getById(id);
      res.json({ success: true, data: { blog: toResponse(blog) } });
    } catch (error) {
      if (error instanceof BlogNotFoundError) {
        sendNotFound(res);
        return;
      }
      throw error;
    }
  };

  const listPublicBlogs: RequestHandler = async (req, res) => {
    const pageResult = parsePositiveInteger(req.query.page, 1);
    const limitResult = parsePositiveInteger(req.query.limit, 9);

    if (
      'error' in pageResult ||
      'error' in limitResult ||
      limitResult.value > pageSizeMaximum ||
      (pageResult.value - 1) * limitResult.value > maximumOffset
    ) {
      sendPaginationError(res);
      return;
    }

    const result = await service.listPublic(
      pageResult.value,
      limitResult.value,
    );
    res.json({
      success: true,
      data: {
        blogs: result.blogs.map(toResponse),
        pagination: result.pagination,
      },
    });
  };

  const getPublicBlog: RequestHandler = async (req, res) => {
    const slug = req.params.slug;
    if (typeof slug !== 'string' || slug.length === 0) {
      res
        .status(400)
        .json({ success: false, message: 'A valid blog slug is required.' });
      return;
    }

    try {
      const blog = await service.getBySlug(slug);
      res.json({ success: true, data: { blog: toResponse(blog) } });
    } catch (error) {
      if (error instanceof BlogNotFoundError) {
        sendNotFound(res);
        return;
      }
      throw error;
    }
  };

  const createBlog: RequestHandler = async (req, res) => {
    const file = req.file;

    try {
      const validation = validateFields(req.body, true);
      if ('error' in validation) {
        res.status(400).json({ success: false, message: validation.error });
        return;
      }

      if (file) {
        const imageError = await validateImage(file);
        if (imageError) {
          res.status(400).json({ success: false, message: imageError });
          return;
        }
      }

      const blog = await service.create(validation.data, file?.path);
      res.status(201).json({
        success: true,
        message: 'Blog created.',
        data: { blog: toResponse(blog) },
      });
    } finally {
      await cleanupTemporaryFile(file);
    }
  };

  const updateBlog: RequestHandler = async (req, res) => {
    const file = req.file;
    const id = req.params.id;

    try {
      if (typeof id !== 'string' || id.length === 0) {
        res
          .status(400)
          .json({ success: false, message: 'A valid blog ID is required.' });
        return;
      }

      const validation = validateFields(req.body, false, Boolean(file));
      if ('error' in validation) {
        res.status(400).json({ success: false, message: validation.error });
        return;
      }

      if (file && validation.data.removeImage) {
        res.status(400).json({
          success: false,
          message:
            'Upload a replacement image or remove the current image, not both.',
        });
        return;
      }

      if (file) {
        const imageError = await validateImage(file);
        if (imageError) {
          res.status(400).json({ success: false, message: imageError });
          return;
        }
      }

      const { removeImage, ...input } = validation.data;
      const blog = await service.update(id, input, {
        ...(file ? { filePath: file.path } : {}),
        ...(removeImage ? { removeImage: true } : {}),
      });

      res.json({
        success: true,
        message: 'Blog updated.',
        data: { blog: toResponse(blog) },
      });
    } catch (error) {
      if (error instanceof BlogNotFoundError) {
        sendNotFound(res);
        return;
      }
      if (error instanceof BlogSlugConflictError) {
        res.status(409).json({
          success: false,
          message: 'Could not generate a unique blog slug.',
        });
        return;
      }
      throw error;
    } finally {
      await cleanupTemporaryFile(file);
    }
  };

  const deleteBlog: RequestHandler = async (req, res) => {
    const id = req.params.id;
    if (typeof id !== 'string' || id.length === 0) {
      res
        .status(400)
        .json({ success: false, message: 'A valid blog ID is required.' });
      return;
    }

    try {
      await service.delete(id);
      res.json({ success: true, message: 'Blog deleted.' });
    } catch (error) {
      if (error instanceof BlogNotFoundError) {
        sendNotFound(res);
        return;
      }
      throw error;
    }
  };

  return {
    listAdminBlogs,
    getAdminBlog,
    listPublicBlogs,
    getPublicBlog,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}
