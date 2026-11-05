import { interestOptions } from "@/data/contact";

export interface ContactInput {
  firstName: string;
  lastName: string;
  email: string;
  interest: string;
  message: string;
  /** Honeypot: real users never fill this in. */
  website?: string;
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export type ValidationResult =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Shared by the client form (instant feedback) and the API route (trust boundary). */
export function validateContact(input: unknown): ValidationResult {
  const raw = (
    typeof input === "object" && input !== null ? input : {}
  ) as Record<string, unknown>;

  const data: ContactInput = {
    firstName: clean(raw.firstName, 80),
    lastName: clean(raw.lastName, 80),
    email: clean(raw.email, 254).toLowerCase(),
    interest: clean(raw.interest, 80),
    message: clean(raw.message, 2000),
    website: clean(raw.website, 200),
  };

  const errors: ContactErrors = {};

  if (!data.firstName) errors.firstName = "Please enter your first name.";
  if (!data.lastName) errors.lastName = "Please enter your last name.";
  if (!EMAIL_PATTERN.test(data.email))
    errors.email = "Please enter a valid email address.";
  if (!interestOptions.includes(data.interest)) {
    errors.interest = "Please choose what you are interested in.";
  }
  if (data.message.length < 10) {
    errors.message = "Please tell us a little more (at least 10 characters).";
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}
