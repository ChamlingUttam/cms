import type { RequestHandler } from 'express';
import {
  ContactAlreadyExistsError,
  ContactNotFoundError,
  createGlobalContact,
  deleteGlobalContact,
  getGlobalContact,
  updateGlobalContact,
} from './service';

type ContactField = 'address' | 'email' | 'phoneNo';
type ContactInput = Partial<Record<ContactField, string | null>>;

const contactFields: ContactField[] = ['address', 'email', 'phoneNo'];

function validateContactInput(
  body: unknown,
  requireAtLeastOneField: boolean,
): { data: ContactInput } | { error: string } {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { error: 'The request body must be an object.' };
  }

  const input = body as Record<string, unknown>;
  const keys = Object.keys(input);

  if (keys.some((key) => !contactFields.includes(key as ContactField))) {
    return { error: 'Only address, email, and phoneNo are supported.' };
  }

  if (requireAtLeastOneField && keys.length === 0) {
    return { error: 'Provide at least one contact field to update.' };
  }

  const data: ContactInput = {};

  for (const field of contactFields) {
    if (!Object.prototype.hasOwnProperty.call(input, field)) {
      continue;
    }

    const value = input[field];

    if (value === null) {
      data[field] = null;
      continue;
    }

    if (typeof value !== 'string') {
      return { error: `${field} must be a string or null.` };
    }

    const normalizedValue = value.trim();

    if (field === 'email' && normalizedValue.length > 0) {
      const emails = normalizedValue.split(/[,/]/);
      const validEmails = emails.every((email) =>
        /^[^\s@,/]+@[^\s@,/]+\.[^\s@,/]+$/.test(email.trim()),
      );

      if (!validEmails) {
        return {
          error:
            'Provide valid email addresses separated by commas or slashes.',
        };
      }
    }

    if (field === 'phoneNo' && normalizedValue.length > 0) {
      const phoneNumbers = normalizedValue.split(/[,/]/);
      const validPhoneNumbers = phoneNumbers.every((phoneNumber) => {
        const trimmedPhoneNumber = phoneNumber.trim();
        return (
          /\d/.test(trimmedPhoneNumber) &&
          /^\+?[\d\s().-]+$/.test(trimmedPhoneNumber)
        );
      });

      if (!validPhoneNumbers) {
        return {
          error:
            'Provide phone numbers separated by commas or slashes using digits and common phone punctuation.',
        };
      }
    }

    data[field] = normalizedValue;
  }

  return { data };
}

export const getContact: RequestHandler = async (_req, res) => {
  const contact = await getGlobalContact();

  if (!contact) {
    res.status(404).json({
      success: false,
      message: 'Contact information not found.',
    });
    return;
  }

  res.json({ success: true, data: { contact } });
};

export const createContact: RequestHandler = async (req, res) => {
  const validation = validateContactInput(req.body, false);

  if ('error' in validation) {
    res.status(400).json({ success: false, message: validation.error });
    return;
  }

  try {
    const contact = await createGlobalContact(validation.data);
    res.status(201).json({
      success: true,
      message: 'Contact information created.',
      data: { contact },
    });
  } catch (error) {
    if (error instanceof ContactAlreadyExistsError) {
      res.status(409).json({
        success: false,
        message: 'Contact information already exists.',
      });
      return;
    }

    throw error;
  }
};

export const updateContact: RequestHandler = async (req, res) => {
  const validation = validateContactInput(req.body, true);

  if ('error' in validation) {
    res.status(400).json({ success: false, message: validation.error });
    return;
  }

  try {
    const contact = await updateGlobalContact(validation.data);
    res.json({
      success: true,
      message: 'Contact information updated.',
      data: { contact },
    });
  } catch (error) {
    if (error instanceof ContactNotFoundError) {
      res.status(404).json({
        success: false,
        message: 'Contact information not found.',
      });
      return;
    }

    throw error;
  }
};

export const deleteContact: RequestHandler = async (_req, res) => {
  try {
    await deleteGlobalContact();
    res.json({
      success: true,
      message: 'Contact information deleted.',
    });
  } catch (error) {
    if (error instanceof ContactNotFoundError) {
      res.status(404).json({
        success: false,
        message: 'Contact information not found.',
      });
      return;
    }

    throw error;
  }
};
