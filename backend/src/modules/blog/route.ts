import { requireAdmin } from '../../middlewares/requireAdmin';
import { cloudinaryStorage } from '../gallery/storage';
import { createBlogController } from './controller';
import { blogRepository } from './repository';
import { createBlogRouters } from './routerFactory';
import { createBlogService } from './service';

const blogService = createBlogService(blogRepository, cloudinaryStorage);
const blogController = createBlogController(blogService);

const { adminRouter: adminBlogRouter, publicRouter: publicBlogRouter } =
  createBlogRouters(blogController, requireAdmin);

export { adminBlogRouter, publicBlogRouter };
