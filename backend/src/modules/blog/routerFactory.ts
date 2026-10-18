import { Router } from 'express';
import type { RequestHandler } from 'express';
import { tmpdir } from 'node:os';
import multer from 'multer';
import type { createBlogController } from './controller';

type BlogController = ReturnType<typeof createBlogController>;

const maximumImageBytes = 5 * 1024 * 1024;
const maximumRequestBytes = maximumImageBytes + 256 * 1024;

const upload = multer({
  dest: tmpdir(),
  limits: {
    fileSize: maximumImageBytes,
    files: 1,
    fields: 4,
    parts: 5,
    fieldNameSize: 32,
    fieldSize: 200_000,
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
      message: 'Blog request must not exceed 5 MiB plus form data.',
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

export function createBlogRouters(
  controller: BlogController,
  requireAdmin: RequestHandler,
) {
  const publicRouter = Router();
  const adminRouter = Router();

  publicRouter.get('/', controller.listPublicBlogs);
  publicRouter.get('/:slug', controller.getPublicBlog);

  adminRouter.use(requireAdmin);
  adminRouter.get('/', controller.listAdminBlogs);
  adminRouter.get('/:id', controller.getAdminBlog);
  adminRouter.post(
    '/',
    enforceRequestSizeLimit,
    parseOptionalImage,
    controller.createBlog,
  );
  adminRouter.patch(
    '/:id',
    enforceRequestSizeLimit,
    parseOptionalImage,
    controller.updateBlog,
  );
  adminRouter.delete('/:id', controller.deleteBlog);

  return { adminRouter, publicRouter };
}
