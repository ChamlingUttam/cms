import { Router } from 'express';
import argon2 from 'argon2';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import config from '../config/config';
import { requireAdmin } from '../middlewares/requireAdmin';
import { prisma } from '../lib/prisma';
import { Prisma } from '../generated/prisma/client';

const router = Router();


//only 5 try are allowed in 15min either it lgoin is fail or sucess

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

function createAdminToken(admin: {
  id: string;
  username: string;
  authVersion: number;
}) {
  return jwt.sign(
    { username: admin.username, ver: admin.authVersion },
    config.jwtSecret,
    {
      algorithm: 'HS256',
      subject: admin.id,
      expiresIn: '1h' satisfies SignOptions['expiresIn'],
    },
  );
}


//fot login 
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body ?? {};

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    username.trim().length === 0 ||
    username.trim().length > 64 ||
    password.length === 0
  ) {
    res.status(400).json({
      success: false,
      message: 'A valid username and password are required.',
    });
    return;
  }

  const normalizedUsername = username.trim().toLowerCase();
  const admin = await prisma.admin.findUnique({
    where: { username: normalizedUsername },
  });

  if (!admin || !(await argon2.verify(admin.passwordHash, password))) {
    res.status(401).json({
      success: false,
      message: 'Invalid username or password.',
    });
    return;
  }

  res.json({
    success: true,
    data: {
      token: createAdminToken(admin),
      admin: { id: admin.id, username: admin.username },
    },
  });
});


//for changin the fields either the username or password
router.patch(
  '/change-fields',
  requireAdmin,
  credentialChangeLimiter,
  async (req, res) => {
    const { currentPassword, newUsername, newPassword } = req.body ?? {};
    const hasUsername = newUsername !== undefined;
    const hasPassword = newPassword !== undefined;

    if (
      typeof currentPassword !== 'string' ||
      currentPassword.length === 0 ||
      (!hasUsername && !hasPassword) ||
      (hasUsername &&
        (typeof newUsername !== 'string' ||
          newUsername.trim().length === 0 ||
          newUsername.trim().length > 64)) ||
      (hasPassword &&
        (typeof newPassword !== 'string' || newPassword.length < 8))
    ) {
      res.status(400).json({
        success: false,
        message:
          'Provide your current password and a new username and/or a password of at least 12 characters.',
      });
      return;
    }

    const adminId = req.admin?.id;

    if (!adminId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin || !(await argon2.verify(admin.passwordHash, currentPassword))) {
      res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
      return;
    }

    const username =
      typeof newUsername === 'string'
        ? newUsername.trim().toLowerCase()
        : undefined;
    const passwordHash =
      typeof newPassword === 'string'
        ? await argon2.hash(newPassword)
        : undefined;

    try {
      const updatedAdmin = await prisma.admin.update({
        where: { id: admin.id },
        data: {
          ...(username ? { username } : {}),
          ...(passwordHash ? { passwordHash } : {}),
          authVersion: { increment: 1 },
        },
        select: { id: true, username: true, authVersion: true },
      });

      res.json({
        success: true,
        message: 'Admin credentials updated.',
        data: {
          token: createAdminToken(updatedAdmin),
          admin: { id: updatedAdmin.id, username: updatedAdmin.username },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        res.status(409).json({
          success: false,
          message: 'That username is already in use.',
        });
        return;
      }
      throw error;
    }
  },
);

router.get('/me', requireAdmin, (req, res) => {
  res.json({ success: true, data: { admin: req.admin } });
});

export default router;
