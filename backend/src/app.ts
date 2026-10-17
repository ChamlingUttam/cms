import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import adminAuthRouter from './modules/auth/route';
import {
  adminContactRouter,
  publicContactRouter,
} from './modules/contact/route';
import { adminFaqRouter, publicFaqRouter } from './modules/faq/route';

const app = express();

app.use(express.json());
app.use('/api/admin', adminAuthRouter);
app.use('/api/admin/contact', adminContactRouter);
app.use('/api/contact', publicContactRouter);
app.use('/api/admin/faqs', adminFaqRouter);
app.use('/api/faqs', publicFaqRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
