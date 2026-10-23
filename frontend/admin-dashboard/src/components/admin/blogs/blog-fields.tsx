'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Check, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BlogInput } from '@/types/content';

export function BlogFields({
  initialValue,
  currentImageUrl,
  submitLabel,
  pending,
  onCancel,
  onSubmit,
}: {
  initialValue?: BlogInput;
  currentImageUrl?: string | null;
  submitLabel: string;
  pending: boolean;
  onCancel?: () => void;
  onSubmit: (input: BlogInput) => Promise<boolean>;
}) {
  const fieldId = useId();
  const [name, setName] = useState(initialValue?.name ?? '');
  const [shortDescription, setShortDescription] = useState(
    initialValue?.shortDescription ?? '',
  );
  const [longDescription, setLongDescription] = useState(
    initialValue?.longDescription ?? '',
  );
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage.preview);
      }
    },
    [selectedImage],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved = await onSubmit({
      name: name.trim(),
      shortDescription: shortDescription.trim(),
      longDescription: longDescription.trim(),
      ...(selectedImage ? { image: selectedImage.file } : {}),
      ...(removeImage ? { removeImage: true } : {}),
    });

    if (saved && !initialValue) {
      setName('');
      setShortDescription('');
      setLongDescription('');
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={`${fieldId}-name`}>
          Article title
        </label>
        <Input
          autoComplete="off"
          id={`${fieldId}-name`}
          maxLength={180}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. A welcoming start to the school year"
          required
          value={name}
        />
        <p className="text-right text-xs text-muted-foreground">
          {name.length}/180
        </p>
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium"
          htmlFor={`${fieldId}-short-description`}
        >
          Short description
        </label>
        <textarea
          className="flex min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          id={`${fieldId}-short-description`}
          maxLength={500}
          onChange={(event) => setShortDescription(event.target.value)}
          placeholder="A concise summary shown in article previews"
          required
          value={shortDescription}
        />
        <p className="text-right text-xs text-muted-foreground">
          {shortDescription.length}/500
        </p>
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium"
          htmlFor={`${fieldId}-long-description`}
        >
          Article content
        </label>
        <textarea
          className="flex min-h-64 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          id={`${fieldId}-long-description`}
          maxLength={50_000}
          onChange={(event) => setLongDescription(event.target.value)}
          placeholder="Write the full article. Separate paragraphs with a blank line."
          required
          value={longDescription}
        />
        <p className="text-right text-xs text-muted-foreground">
          {longDescription.length.toLocaleString()}/50,000
        </p>
      </div>

      <div className="space-y-3">
        <label
          className="text-sm font-medium"
          htmlFor={`${fieldId}-image`}
        >
          Cover image{' '}
          <span className="text-muted-foreground">
            (optional, JPG or PNG up to 5 MB)
          </span>
        </label>
        <Input
          accept="image/jpeg,image/png"
          disabled={pending}
          id={`${fieldId}-image`}
          onChange={(event) => {
            const file = event.target.files?.[0];
            setSelectedImage(
              file ? { file, preview: URL.createObjectURL(file) } : null,
            );
            setRemoveImage(false);
          }}
          ref={fileInputRef}
          type="file"
        />
        {(selectedImage || (currentImageUrl && !removeImage)) && (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={selectedImage ? 'Selected cover image preview' : 'Current cover image'}
              className="h-16 w-24 rounded-lg border object-cover"
              src={selectedImage?.preview ?? currentImageUrl ?? ''}
            />
            <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
              {selectedImage ? selectedImage.file.name : 'Current cover image'}
            </p>
            {selectedImage && (
              <Button
                aria-label="Remove selected cover image"
                onClick={() => {
                  setSelectedImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X aria-hidden="true" />
              </Button>
            )}
          </div>
        )}
        {currentImageUrl && !selectedImage && (
          <label className="flex w-fit items-center gap-2 text-sm text-muted-foreground">
            <input
              checked={removeImage}
              disabled={pending}
              onChange={(event) => setRemoveImage(event.target.checked)}
              type="checkbox"
            />
            Remove current cover image
          </label>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button disabled={pending} type="submit">
          {initialValue ? (
            <Check aria-hidden="true" />
          ) : (
            <ImagePlus aria-hidden="true" />
          )}
          {pending ? 'Saving…' : submitLabel}
        </Button>
        {onCancel && (
          <Button
            disabled={pending}
            onClick={onCancel}
            type="button"
            variant="outline"
          >
            <X aria-hidden="true" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
