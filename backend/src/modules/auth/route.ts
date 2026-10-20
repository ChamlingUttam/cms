import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAdmin } from '../../middlewares/requireAdmin';
import {
  changeAdminFields,
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from './controller';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
  },
});

const credentialChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many credential change attempts. Please try again later.',
  },
});

router.post('/login', loginLimiter, loginAdmin);
router.patch(
  '/change-fields',
  requireAdmin,
  credentialChangeLimiter,
  changeAdminFields,
);
router.get('/me', requireAdmin, getCurrentAdmin);
router.post('/logout', requireAdmin, logoutAdmin);

export default router;
