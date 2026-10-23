import { open, rm } from 'node:fs/promises';
import type { Request, RequestHandler, Response } from 'express';
import { getImageDelivery } from './delivery';
import {
  GalleryImageNotFoundError,
  type GalleryImageRecord,
  type GalleryDateRange,
  type GalleryService,
  type GalleryUploadResult,
} from './service';

const maximumPageSize = 50;
const maximumPaginationOffset = 2_147_483_647;
const jpegSignature = Buffer.from([0xff, 0xd8, 0xff]);
const pngSignature = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const kathmanduOffsetMinutes = 5 * 60 + 45;

type UploadedFile = Express.Multer.File;

function getUploadedFiles(req: Request): UploadedFile[] {
  const files = req.files;

  if (Array.isArray(files)) {
    return files;
  }

  if (!files || typeof files !== 'object') {
    return [];
  }

  return [...(files.images ?? []), ...(files.image ?? [])];
}

function getSafeFilename(filename: string) {
  return (
    filename
      .split(/[\\/]/)
      .pop()
      ?.replace(/[\u0000-\u001f\u007f]/g, '')
      .slice(0, 255) || 'image'
  );
}

async function validateImage(file: UploadedFile) {
  const isJpeg =
    file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg';
  const isPng = file.mimetype === 'image/png';

  if (!isJpeg && !isPng) {
    return 'Only JPG, JPEG, and PNG images are allowed.';
  }

  const signature = isJpeg ? jpegSignature : pngSignature;
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

function toGalleryResponse(image: GalleryImageRecord) {
  const { publicId: _publicId, ...publicImage } = image;
  return {
    ...publicImage,
    ...getImageDelivery(image.imageUrl),
    loading: 'lazy' as const,
  };
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

function parseCalendarDate(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  if (
    year < 1 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function parseDateRange(from: unknown, to: unknown) {
  if (from === undefined && to === undefined) {
    return { dateRange: undefined };
  }

  const fromDate = from === undefined ? undefined : parseCalendarDate(from);
  const toDate = to === undefined ? undefined : parseCalendarDate(to);

  if ((from !== undefined && !fromDate) || (to !== undefined && !toDate)) {
    return {
      error: 'From and to must be valid dates in YYYY-MM-DD format.',
    };
  }

  if (fromDate && toDate && fromDate.getTime() > toDate.getTime()) {
    return { error: 'The from date must be on or before the to date.' };
  }

  const dateRange: GalleryDateRange = {};

  if (fromDate) {
    dateRange.from = new Date(
      fromDate.getTime() - kathmanduOffsetMinutes * 60_000,
    );
  }

  if (toDate) {
    toDate.setUTCDate(toDate.getUTCDate() + 1);
    dateRange.to = new Date(toDate.getTime() - kathmanduOffsetMinutes * 60_000);
  }

  return { dateRange };
}

async function cleanupTemporaryFiles(files: UploadedFile[]) {
  const cleanupResults = await Promise.allSettled(
    files.map((file) => rm(file.path, { force: true })),
  );

  cleanupResults.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(
        'Failed to remove a temporary gallery upload file.',
        files[index].path,
        result.reason,
      );
    }
  });
}

export function createGalleryController(service: GalleryService) {
  const getImages: RequestHandler = async (req, res) => {
    const defaultLimit = req.admin ? 20 : 12;
    const pageResult = parsePositiveInteger(req.query.page, 1);
    const limitResult = parsePositiveInteger(req.query.limit, defaultLimit);
    const dateRangeResult = parseDateRange(req.query.from, req.query.to);

    if (
      'error' in pageResult ||
      'error' in limitResult ||
      'error' in dateRangeResult ||
      limitResult.value > maximumPageSize ||
      (pageResult.value - 1) * limitResult.value > maximumPaginationOffset
    ) {
      if ('error' in dateRangeResult) {
        res.status(400).json({
          success: false,
          message: dateRangeResult.error,
        });
      } else {
        sendPaginationError(res);
      }
      return;
    }

    const result = await service.list(
      pageResult.value,
      limitResult.value,
      dateRangeResult.dateRange,
    );
    res.json({
      success: true,
      data: {
        images: result.images.map(toGalleryResponse),
        pagination: result.pagination,
      },
    });
  };

  const uploadImages: RequestHandler = async (req, res) => {
    const files = getUploadedFiles(req);

    if (files.length === 0) {
      res.status(400).json({
        success: false,
        message:
          'Upload images using the "images" field (or "image" for a single image).',
      });
      return;
    }

    const usesMultipleField = files.some((file) => file.fieldname === 'images');
    const usesSingleField = files.some((file) => file.fieldname === 'image');

    if (usesMultipleField && usesSingleField) {
      await cleanupTemporaryFiles(files);
      res.status(400).json({
        success: false,
        message: 'Use either "images" or "image", not both.',
      });
      return;
    }

    const results: Array<GalleryUploadResult | undefined> = new Array(
      files.length,
    );
    const eligibleFiles: Array<{
      index: number;
      path: string;
      filename: string;
    }> = [];
    let statusCode = 201;
    let responseBody: unknown;

    try {
      for (const [index, file] of files.entries()) {
        const filename = getSafeFilename(file.originalname);
        const validationError = await validateImage(file);

        if (validationError) {
          results[index] = {
            index,
            filename,
            success: false,
            message: validationError,
          };
        } else {
          eligibleFiles.push({ index, path: file.path, filename });
        }
      }

      const uploadedResults = await service.uploadMany(eligibleFiles);

      uploadedResults.forEach((result) => {
        results[result.index] = result;
      });

      const completeResults = results.filter(
        (result): result is GalleryUploadResult => result !== undefined,
      );
      const failures = completeResults.filter((result) => !result.success);
      const legacyImage =
        !usesMultipleField &&
        completeResults.length === 1 &&
        completeResults[0].success
          ? toGalleryResponse(completeResults[0].image)
          : undefined;

      statusCode = failures.length === 0 ? 201 : 207;
      responseBody = {
        success: failures.length === 0,
        message:
          failures.length === 0
            ? 'Gallery images uploaded.'
            : 'Some gallery images could not be uploaded.',
        data: {
          results: completeResults.map((result) =>
            result.success
              ? {
                  ...result,
                  image: toGalleryResponse(result.image),
                }
              : result,
          ),
          ...(legacyImage ? { image: legacyImage } : {}),
        },
      };
    } finally {
      await cleanupTemporaryFiles(files);
    }

    res.status(statusCode).json(responseBody);
  };

  const deleteImage: RequestHandler = async (req, res) => {
    const id = req.params.id;

    if (typeof id !== 'string' || id.length === 0) {
      res
        .status(400)
        .json({ success: false, message: 'A valid image ID is required.' });
      return;
    }

    try {
      await service.delete(id);
      res.json({ success: true, message: 'Gallery image deleted.' });
    } catch (error) {
      if (error instanceof GalleryImageNotFoundError) {
        res
          .status(404)
          .json({ success: false, message: 'Gallery image not found.' });
        return;
      }

      throw error;
    }
  };

  return { getImages, uploadImages, deleteImage };
}
