import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

const GLOBAL_CONTACT_ID = 'global';

type ContactInput = {
  address?: string | null;
  email?: string | null;
  phoneNo?: string | null;
};

export class ContactAlreadyExistsError extends Error {}
export class ContactNotFoundError extends Error {}

export async function getGlobalContact() {
  return prisma.contact.findUnique({
    where: { id: GLOBAL_CONTACT_ID },
  });
}

export async function createGlobalContact(contact: ContactInput) {
  try {
    return await prisma.contact.create({
      data: { id: GLOBAL_CONTACT_ID, ...contact },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ContactAlreadyExistsError();
    }

    throw error;
  }
}

export async function updateGlobalContact(contact: ContactInput) {
  try {
    return await prisma.contact.update({
      where: { id: GLOBAL_CONTACT_ID },
      data: contact,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new ContactNotFoundError();
    }

    throw error;
  }
}

export async function deleteGlobalContact() {
  try {
    return await prisma.contact.delete({
      where: { id: GLOBAL_CONTACT_ID },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new ContactNotFoundError();
    }

    throw error;
  }
}
