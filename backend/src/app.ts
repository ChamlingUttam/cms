import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import adminAuthRouter from './modules/auth/route';
import {
  adminContactRouter,
  publicContactRouter,
} from './modules/contact/route';
import { adminFaqRouter, publicFaqRouter } from './modules/faq/route';
import {
  adminGalleryRouter,
  publicGalleryRouter,
} from './modules/gallery/route';
import {
  adminTestimonialRouter,
  publicTestimonialRouter,
} from './modules/testimonial/route';
import { adminBlogRouter, publicBlogRouter } from './modules/blog/route';

const app = express();

app.use(express.json());
app.use('/api/admin', adminAuthRouter);

app.use('/api/admin/contact', adminContactRouter);
app.use('/api/contact', publicContactRouter);


app.use('/api/admin/faqs', adminFaqRouter);
app.use('/api/faqs', publicFaqRouter);



app.use('/api/admin/gallery', adminGalleryRouter);
app.use('/api/gallery', publicGalleryRouter);


app.use('/api/admin/testimonials', adminTestimonialRouter);
app.use('/api/testimonials', publicTestimonialRouter);



app.use('/api/admin/blogs', adminBlogRouter);
app.use('/api/blogs', publicBlogRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
