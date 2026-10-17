import { Router } from 'express';
import { requireAdmin } from '../../middlewares/requireAdmin';
import { createFaq, deleteFaq, getFaq, getFaqs, updateFaq } from './controller';

export const publicFaqRouter = Router();
export const adminFaqRouter = Router();

publicFaqRouter.get('/', getFaqs);

adminFaqRouter.use(requireAdmin);
adminFaqRouter.get('/', getFaqs);
adminFaqRouter.get('/:id', getFaq);
adminFaqRouter.post('/', createFaq);
adminFaqRouter.patch('/:id', updateFaq);
adminFaqRouter.delete('/:id', deleteFaq);
