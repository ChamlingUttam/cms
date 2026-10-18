import { Router } from 'express';
import type { RequestHandler } from 'express';
import multer from 'multer';
import { tmpdir } from 'node:os';

export type GalleryController = {
  getImages: RequestHandler;
  uploadImages: RequestHandler;
  deleteImage: RequestHandler;
};

const maximumImages = 10;
const maximumImageBytes = 5 * 1024 * 1024;
const maximumRequestBytes = maximumImages * maximumImageBytes + 256 * 1024;

const upload = multer({
  dest: tmpdir(),
  limits: {
    fileSize: maximumImageBytes,
    files: maximumImages,
    fields: 0,
    parts: maximumImages,
    fieldNameSize: 16,
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
      message:
        'Gallery upload request must not exceed 50 MiB plus multipart overhead.',
    });
    return;
  }

  next();
};

export function createGalleryRouters(
  controller: GalleryController,
  requireAdmin: RequestHandler,
) {
  const publicRouter = Router();
  const adminRouter = Router();

  publicRouter.get('/', controller.getImages);

  adminRouter.use(requireAdmin);
  adminRouter.post(
    '/',
    enforceRequestSizeLimit,
    upload.fields([
      { name: 'images', maxCount: maximumImages },
      { name: 'image', maxCount: 1 },
    ]),
    controller.uploadImages,
  );
  adminRouter.get('/', controller.getImages);
  adminRouter.delete('/:id', controller.deleteImage);

  return { adminRouter, publicRouter };
}
