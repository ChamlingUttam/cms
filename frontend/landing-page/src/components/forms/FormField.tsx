import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

/** Label + control + inline error, built on the shadcn Label. */
export function FormField({
  id,
  label,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("mb-[22px] grid gap-[9px]", className)}>
      <Label htmlFor={id} className="text-xs font-bold">
        {label}
      </Label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-destructive text-xs font-medium"
        >
          {error}
        </p>
      )}
    </div>
  );
}
