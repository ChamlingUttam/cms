import { requireAdmin } from '../../middlewares/requireAdmin';
import { createGalleryController } from './controller';
import { galleryRepository } from './repository';
import { createGalleryRouters } from './routerFactory';
import { createGalleryService } from './service';
import { cloudinaryStorage } from './storage';

const galleryService = createGalleryService(
  galleryRepository,
  cloudinaryStorage,
);
const galleryController = createGalleryController(galleryService);

const { adminRouter: adminGalleryRouter, publicRouter: publicGalleryRouter } =
  createGalleryRouters(galleryController, requireAdmin);

export { adminGalleryRouter, publicGalleryRouter };
