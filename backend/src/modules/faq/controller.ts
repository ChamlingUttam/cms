import type { RequestHandler } from 'express';
import {
  FaqNotFoundError,
  createFaqRecord,
  deleteFaqRecord,
  getFaqRecord,
  getFaqRecords,
  updateFaqRecord,
} from './service';

type FaqInput = {
  question?: string;
  answer?: string;
};

const faqFields = ['question', 'answer'] as const;
const questionMaxLength = 500;
const answerMaxLength = 5000;

function validateFaqInput(
  body: unknown,
  requireBothFields: true,
): { data: Required<FaqInput> } | { error: string };
function validateFaqInput(
  body: unknown,
  requireBothFields: false,
): { data: FaqInput } | { error: string };
function validateFaqInput(
  body: unknown,
  requireBothFields: boolean,
): { data: FaqInput } | { error: string } {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { error: 'The request body must be an object.' };
  }

  const input = body as Record<string, unknown>;
  const keys = Object.keys(input);

  if (
    keys.some((key) => !faqFields.includes(key as (typeof faqFields)[number]))
  ) {
    return { error: 'Only question and answer are supported.' };
  }

  if (requireBothFields && faqFields.some((field) => !keys.includes(field))) {
    return { error: 'Both question and answer are required.' };
  }

  if (!requireBothFields && keys.length === 0) {
    return { error: 'Provide at least one FAQ field to update.' };
  }

  const data: FaqInput = {};

  for (const field of faqFields) {
    if (!Object.prototype.hasOwnProperty.call(input, field)) {
      continue;
    }

    const value = input[field];

    if (typeof value !== 'string' || value.trim().length === 0) {
      return { error: `${field} must be a non-empty string.` };
    }

    const normalizedValue = value.trim();
    const maxLength =
      field === 'question' ? questionMaxLength : answerMaxLength;

    if (normalizedValue.length > maxLength) {
      return {
        error: `${field} must not exceed ${maxLength} characters.`,
      };
    }

    data[field] = normalizedValue;
  }

  return { data };
}

function getFaqId(
  req: Parameters<RequestHandler>[0],
  res: Parameters<RequestHandler>[1],
) {
  const id = req.params.id;

  if (typeof id !== 'string' || id.length === 0) {
    res
      .status(400)
      .json({ success: false, message: 'A valid FAQ ID is required.' });
    return null;
  }

  return id;
}

export const getFaqs: RequestHandler = async (req, res) => {
  const faqs = await getFaqRecords({ publicOnly: !req.admin });
  res.json({ success: true, data: { faqs } });
};

export const getFaq: RequestHandler = async (req, res) => {
  const id = getFaqId(req, res);

  if (!id) {
    return;
  }

  try {
    const faq = await getFaqRecord(id);
    res.json({ success: true, data: { faq } });
  } catch (error) {
    if (error instanceof FaqNotFoundError) {
      res.status(404).json({ success: false, message: 'FAQ not found.' });
      return;
    }

    throw error;
  }
};

export const createFaq: RequestHandler = async (req, res) => {
  const validation = validateFaqInput(req.body, true);

  if ('error' in validation) {
    res.status(400).json({ success: false, message: validation.error });
    return;
  }

  const faq = await createFaqRecord(validation.data);
  res.status(201).json({
    success: true,
    message: 'FAQ created.',
    data: { faq },
  });
};

export const updateFaq: RequestHandler = async (req, res) => {
  const validation = validateFaqInput(req.body, false);

  if ('error' in validation) {
    res.status(400).json({ success: false, message: validation.error });
    return;
  }

  const id = getFaqId(req, res);

  if (!id) {
    return;
  }

  try {
    const faq = await updateFaqRecord(id, validation.data);
    res.json({
      success: true,
      message: 'FAQ updated.',
      data: { faq },
    });
  } catch (error) {
    if (error instanceof FaqNotFoundError) {
      res.status(404).json({ success: false, message: 'FAQ not found.' });
      return;
    }

    throw error;
  }
};

export const deleteFaq: RequestHandler = async (req, res) => {
  const id = getFaqId(req, res);

  if (!id) {
    return;
  }

  try {
    await deleteFaqRecord(id);
    res.json({ success: true, message: 'FAQ deleted.' });
  } catch (error) {
    if (error instanceof FaqNotFoundError) {
      res.status(404).json({ success: false, message: 'FAQ not found.' });
      return;
    }

    throw error;
  }
};
