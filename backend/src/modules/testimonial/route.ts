import { requireAdmin } from '../../middlewares/requireAdmin';
import { cloudinaryStorage } from '../gallery/storage';
import { createTestimonialController } from './controller';
import { testimonialRepository } from './repository';
import { createTestimonialRouters } from './routerFactory';
import { createTestimonialService } from './service';

const testimonialService = createTestimonialService(
  testimonialRepository,
  cloudinaryStorage,
);
const testimonialController = createTestimonialController(testimonialService);

const {
  adminRouter: adminTestimonialRouter,
  publicRouter: publicTestimonialRouter,
} = createTestimonialRouters(testimonialController, requireAdmin);

export { adminTestimonialRouter, publicTestimonialRouter };
