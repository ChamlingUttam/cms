"use client";

import { CircleAlertIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { FormField } from "@/components/forms/FormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { IconBox } from "@/components/ui/IconBox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { interestOptions } from "@/data/contact";
import { validateContact, type ContactErrors } from "@/lib/validation";
import { siteConfig } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

const aria = (id: string, error?: string) => ({
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? `${id}-error` : undefined,
});

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [serverError, setServerError] = useState("");
  const [interest, setInterest] = useState("");

  /** Clears a field's error as soon as the user edits that field. */
  function clearError(field: string) {
    setErrors((current) =>
      current[field as keyof ContactErrors]
        ? { ...current, [field]: undefined }
        : current
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const { contact } = siteConfig;

    event.preventDefault();
    const form = event.currentTarget;
    const result = validateContact({
      ...Object.fromEntries(new FormData(form)),
      interest,
    });

    if (!result.ok) {
      setErrors(result.errors);
      setServerError("");
      return;
    }

    setErrors({});
    setServerError("");
    setStatus("submitting");

    try {
      // const response = await fetch("/api/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(result.data),
      // });
      const response = await fetch(
        `https://formsubmit.co/ajax/{contact.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...result.data,
            _subject: "New enquiry from Brightwood Academy Website",
          }),
        }
      );
      const payload = (await response.json().catch(() => null)) as {
        message?: string;
        errors?: ContactErrors;
      } | null;

      if (response.ok) {
        form.reset();
        setInterest("");
        setStatus("success");
        return;
      }

      if (payload?.errors) setErrors(payload.errors);
      setServerError(
        payload?.message ?? "Something went wrong. Please try again."
      );
      setStatus("error");
    } catch {
      setServerError(
        "We couldn’t send your message. Check your connection and try again."
      );
      setStatus("error");
    }
  }

  const formShell =
    "relative border border-line bg-white p-5 shadow-[8px_8px_0_#f0ba42] sm:p-8 lg:p-12 lg:shadow-[14px_14px_0_#f0ba42]";

  if (status === "success") {
    return (
      <div
        role="status"
        className={`${formShell} flex min-h-[420px] flex-col items-center justify-center text-center`}
      >
        <IconBox name="check" className="mb-6" />
        <h2 className="text-[clamp(2.25rem,5vw,4.7rem)]">Thank you!</h2>
        <p className="mx-auto mt-[18px] mb-[25px] max-w-[400px]">
          We’ve received your message and will be in touch within two school
          days.
        </p>
        <Button variant="link" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      onChange={(event) =>
        clearError((event.target as unknown as HTMLInputElement).name)
      }
      noValidate
      className={formShell}
      aria-label="Enquiry form"
    >
      <div className="sm:grid sm:grid-cols-2 sm:gap-[18px]">
        <FormField id="firstName" label="First name" error={errors.firstName}>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            maxLength={80}
            placeholder="Your first name"
            {...aria("firstName", errors.firstName)}
          />
        </FormField>
        <FormField id="lastName" label="Last name" error={errors.lastName}>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            maxLength={80}
            placeholder="Your last name"
            {...aria("lastName", errors.lastName)}
          />
        </FormField>
      </div>

      <FormField id="email" label="Email address" error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@example.com"
          {...aria("email", errors.email)}
        />
      </FormField>

      <FormField
        id="interest"
        label="I’m interested in"
        error={errors.interest}
      >
        <Select
          value={interest}
          onValueChange={(value) => {
            setInterest(value);
            clearError("interest");
          }}
        >
          <SelectTrigger id="interest" {...aria("interest", errors.interest)}>
            <SelectValue placeholder="Select a program" />
          </SelectTrigger>
          <SelectContent>
            {interestOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField id="message" label="Message" error={errors.message}>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={2000}
          placeholder="How can we help?"
          {...aria("message", errors.message)}
        />
      </FormField>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {serverError && (
        <Alert variant="destructive" className="mb-5">
          <CircleAlertIcon />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? (
          "Sending…"
        ) : (
          <>
            Send enquiry
            <Icon name="arrow" size={18} />
          </>
        )}
      </Button>
    </form>
  );
}
