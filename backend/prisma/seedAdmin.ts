import 'dotenv/config';
import argon2 from 'argon2';
import { prisma } from '../src/lib/prisma';

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!username || username.length > 64) {
    throw new Error(
      'Set ADMIN_USERNAME to a non-empty username of at most 64 characters.',
    );
  }

  if (!password || password.length < 8) {
    throw new Error(
      'Set ADMIN_PASSWORD to a password of at least 12 characters.',
    );
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: { username },
    select: { id: true },
  });

  if (existingAdmin) {
    throw new Error(`An admin with username "${username}" already exists.`);
  }

  const passwordHash = await argon2.hash(password);
  await prisma.admin.create({
    data: { username, passwordHash },
  });

  console.log(`Admin "${username}" created.`);
}

seedAdmin()
  .catch((error: unknown) => {
    console.error('Could not create admin:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
