import { Router } from 'express';
import type { RequestHandler } from 'express';
import { tmpdir } from 'node:os';
import multer from 'multer';

export type TestimonialController = {
  listTestimonials: RequestHandler;
  createTestimonial: RequestHandler;
  updateTestimonial: RequestHandler;
  deleteTestimonial: RequestHandler;
};

const maximumImageBytes = 5 * 1024 * 1024;
const maximumRequestBytes = maximumImageBytes + 64 * 1024;

const upload = multer({
  dest: tmpdir(),
  limits: {
    fileSize: maximumImageBytes,
    files: 1,
    fields: 4,
    parts: 5,
    fieldNameSize: 32,
    fieldSize: 1000,
    headerPairs: 32,
  },
});

const enforceRequestSizeLimit: RequestHandler = (req, res, next) => {
  const contentLength = req.get('content-length');

  if (
    contentLength &&
    /^\d+$/.test(contentLength) &&
    Number(contentLength) > maximumRequestBytes
  ) {
    res.status(413).json({
      success: false,
      message: 'Testimonial request must not exceed 5 MiB plus form data.',
    });
    return;
  }

  next();
};

const parseOptionalImage: RequestHandler = (req, res, next) => {
  upload.single('image')(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      const message =
        error.code === 'LIMIT_FILE_SIZE'
          ? 'Image must not exceed 5 MiB.'
          : 'Upload at most one image using the "image" field.';
      res.status(status).json({ success: false, message });
      return;
    }

    if (error) {
      next(error);
      return;
    }

    next();
  });
};

export function createTestimonialRouters(
  controller: TestimonialController,
  requireAdmin: RequestHandler,
) {
  const publicRouter = Router();
  const adminRouter = Router();

  publicRouter.get('/', controller.listTestimonials);

  adminRouter.use(requireAdmin);
  adminRouter.get('/', controller.listTestimonials);
  adminRouter.post(
    '/',
    enforceRequestSizeLimit,
    parseOptionalImage,
    controller.createTestimonial,
  );
  adminRouter.patch(
    '/:id',
    enforceRequestSizeLimit,
    parseOptionalImage,
    controller.updateTestimonial,
  );
  adminRouter.delete('/:id', controller.deleteTestimonial);

  return { adminRouter, publicRouter };
}
