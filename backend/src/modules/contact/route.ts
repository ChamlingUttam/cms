import { Router } from 'express';
import { requireAdmin } from '../../middlewares/requireAdmin';
import {
  createContact,
  deleteContact,
  getContact,
  updateContact,
} from './controller';

export const publicContactRouter = Router();
export const adminContactRouter = Router();

publicContactRouter.get('/', getContact);

adminContactRouter.get('/', requireAdmin, getContact);
adminContactRouter.post('/', requireAdmin, createContact);
adminContactRouter.patch('/', requireAdmin, updateContact);
adminContactRouter.delete('/', requireAdmin, deleteContact);
