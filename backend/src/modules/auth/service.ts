import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { Prisma } from '../../generated/prisma/client';
import config from '../../config/config';
import { prisma } from '../../lib/prisma';

type AdminTokenData = {
  id: string;
  username: string;
  authVersion: number;
};

type ChangedCredentials = {
  currentPassword: string;
  newUsername?: string;
  newPassword?: string;
};

export class AdminUsernameConflictError extends Error {}

function createAdminToken(admin: AdminTokenData) {
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

function toAuthResponse(admin: AdminTokenData) {
  return {
    token: createAdminToken(admin),
    admin: { id: admin.id, username: admin.username },
  };
}

export async function verifyAdminCredentials(
  username: string,
  password: string,
) {
  const normalizedUsername = username.trim().toLowerCase();
  const admin = await prisma.admin.findUnique({
    where: { username: normalizedUsername },
  });

  if (!admin || !(await argon2.verify(admin.passwordHash, password))) {
    return null;
  }

  return toAuthResponse(admin);
}

export async function changeAdminCredentials(
  adminId: string,
  credentials: ChangedCredentials,
) {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  if (
    !admin ||
    !(await argon2.verify(admin.passwordHash, credentials.currentPassword))
  ) {
    return null;
  }

  const username =
    typeof credentials.newUsername === 'string'
      ? credentials.newUsername.trim().toLowerCase()
      : undefined;
  const passwordHash =
    typeof credentials.newPassword === 'string'
      ? await argon2.hash(credentials.newPassword)
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

    return toAuthResponse(updatedAdmin);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new AdminUsernameConflictError();
    }

    throw error;
  }
}
