import { open, rm } from 'node:fs/promises';
import type { RequestHandler } from 'express';
import { getImageDelivery } from '../gallery/delivery';
import {
  TestimonialNotFoundError,
  type TestimonialRecord,
  type TestimonialService,
} from './service';

const maxNameLength = 120;
const maxDescriptionLength = 1000;
const maxProfessionLength = 120;
const jpegSignature = Buffer.from([0xff, 0xd8, 0xff]);
const pngSignature = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

type TestimonialFields = {
  name?: string;
  description?: string;
  profession?: string | null;
  removeImage?: boolean;
};

type TestimonialCreateFields = TestimonialFields & {
  name: string;
  description: string;
};

function validateFields(
  body: unknown,
  isCreate: true,
  allowImageOnly?: boolean,
): { data: TestimonialCreateFields } | { error: string };
function validateFields(
  body: unknown,
  isCreate: false,
  allowImageOnly?: boolean,
): { data: TestimonialFields } | { error: string };
function validateFields(
  body: unknown,
  isCreate: boolean,
  allowImageOnly = false,
): { data: TestimonialFields } | { error: string } {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { error: 'The request body must be an object.' };
  }

  const input = body as Record<string, unknown>;
  const allowedFields = ['name', 'description', 'profession', 'removeImage'];

  if (Object.keys(input).some((key) => !allowedFields.includes(key))) {
    return {
      error:
        'Only name, description, profession, and removeImage are supported.',
    };
  }

  if (isCreate && (!('name' in input) || !('description' in input))) {
    return { error: 'Name and description are required.' };
  }

  const data: TestimonialFields = {};

  for (const field of ['name', 'description'] as const) {
    if (!Object.prototype.hasOwnProperty.call(input, field)) {
      continue;
    }

    const value = input[field];

    if (typeof value !== 'string' || value.trim().length === 0) {
      return { error: `${field} must be a non-empty string.` };
    }

    const normalized = value.trim();
    const maxLength = field === 'name' ? maxNameLength : maxDescriptionLength;

    if (normalized.length > maxLength) {
      return {
        error: `${field} must not exceed ${maxLength} characters.`,
      };
    }

    data[field] = normalized;
  }

  if (Object.prototype.hasOwnProperty.call(input, 'profession')) {
    const value = input.profession;

    if (value !== null && typeof value !== 'string') {
      return { error: 'profession must be a string or null.' };
    }

    if (
      typeof value === 'string' &&
      value.trim().length > maxProfessionLength
    ) {
      return {
        error: `profession must not exceed ${maxProfessionLength} characters.`,
      };
    }

    data.profession =
      typeof value === 'string' && value.trim().length > 0
        ? value.trim()
        : null;
  }

  if (Object.prototype.hasOwnProperty.call(input, 'removeImage')) {
    const value = input.removeImage;
    const shouldRemove =
      value === true || value === 'true'
        ? true
        : value === false || value === 'false'
          ? false
          : null;

    if (shouldRemove === null) {
      return { error: 'removeImage must be a boolean.' };
    }

    data.removeImage = shouldRemove;
  }

  if (
    !isCreate &&
    !allowImageOnly &&
    Object.keys(data).every((key) => key === 'removeImage') &&
    data.removeImage !== true
  ) {
    return { error: 'Provide at least one testimonial field to update.' };
  }

  return { data };
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

async function removeTemporaryFile(file: Express.Multer.File | undefined) {
  if (!file) {
    return;
  }

  try {
    await rm(file.path, { force: true });
  } catch (error) {
    console.error(
      'Failed to remove a temporary testimonial image file.',
      file.path,
      error,
    );
  }
}

function toResponse(testimonial: TestimonialRecord) {
  return {
    ...testimonial,
    ...(testimonial.imageUrl
      ? getImageDelivery(testimonial.imageUrl)
      : { srcSet: null }),
  };
}

function sendNotFound(res: Parameters<RequestHandler>[1]) {
  res.status(404).json({
    success: false,
    message: 'Testimonial not found.',
  });
}

export function createTestimonialController(service: TestimonialService) {
  const listTestimonials: RequestHandler = async (_req, res) => {
    const testimonials = await service.list();
    res.json({
      success: true,
      data: { testimonials: testimonials.map(toResponse) },
    });
  };

  const createTestimonial: RequestHandler = async (req, res) => {
    const file = req.file;

    try {
      const validation = validateFields(req.body, true);

      if ('error' in validation) {
        res.status(400).json({ success: false, message: validation.error });
        return;
      }

      if (
        Object.prototype.hasOwnProperty.call(validation.data, 'removeImage')
      ) {
        res.status(400).json({
          success: false,
          message: 'removeImage is only supported when updating a testimonial.',
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

      const { removeImage: _removeImage, ...input } = validation.data;
      const testimonial = await service.create(input, file?.path);

      res.status(201).json({
        success: true,
        message: 'Testimonial created.',
        data: { testimonial: toResponse(testimonial) },
      });
    } finally {
      await removeTemporaryFile(file);
    }
  };

  const updateTestimonial: RequestHandler = async (req, res) => {
    const file = req.file;
    const id = req.params.id;

    try {
      if (typeof id !== 'string' || id.length === 0) {
        res.status(400).json({
          success: false,
          message: 'A valid testimonial ID is required.',
        });
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
      const testimonial = await service.update(id, input, {
        ...(file ? { filePath: file.path } : {}),
        ...(removeImage ? { removeImage: true } : {}),
      });

      res.json({
        success: true,
        message: 'Testimonial updated.',
        data: { testimonial: toResponse(testimonial) },
      });
    } catch (error) {
      if (error instanceof TestimonialNotFoundError) {
        sendNotFound(res);
        return;
      }

      throw error;
    } finally {
      await removeTemporaryFile(file);
    }
  };

  const deleteTestimonial: RequestHandler = async (req, res) => {
    const id = req.params.id;

    if (typeof id !== 'string' || id.length === 0) {
      res.status(400).json({
        success: false,
        message: 'A valid testimonial ID is required.',
      });
      return;
    }

    try {
      await service.delete(id);
      res.json({
        success: true,
        message: 'Testimonial deleted.',
      });
    } catch (error) {
      if (error instanceof TestimonialNotFoundError) {
        sendNotFound(res);
        return;
      }

      throw error;
    }
  };

  return {
    listTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
  };
}
