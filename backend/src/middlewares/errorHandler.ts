import type { ErrorRequestHandler } from 'express';
import multer from 'multer';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Image must not exceed 5 MiB.'
        : err.code === 'LIMIT_FILE_COUNT' ||
            err.code === 'LIMIT_UNEXPECTED_FILE'
          ? 'Upload at most 10 images using the "images" field, or one image using the "image" field.'
          : 'The multipart upload exceeds the allowed file or request limits.';

    res.status(status).json({ success: false, message });
    return;
  }

  const status =
    typeof err.status === 'number' && err.status >= 400 && err.status <= 599
      ? err.status
      : 500;

  const message =
    status === 500 ? 'Internal Server Error' : err.message || 'Request failed';

  res.status(status).json({
    success: false,
    message,
  });
};
