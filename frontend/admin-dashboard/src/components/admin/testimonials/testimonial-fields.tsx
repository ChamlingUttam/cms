'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { Check, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TestimonialInput } from '@/types/content';

export function TestimonialFields({
  initialValue,
  currentImageUrl,
  submitLabel,
  pending,
  onCancel,
  onSubmit,
}: {
  initialValue?: TestimonialInput;
  currentImageUrl?: string | null;
  submitLabel: string;
  pending: boolean;
  onCancel?: () => void;
  onSubmit: (input: TestimonialInput) => Promise<boolean>;
}) {
  const fieldId = useId();
  const nameId = `${fieldId}-name`;
  const professionId = `${fieldId}-profession`;
  const descriptionId = `${fieldId}-description`;
  const imageId = `${fieldId}-image`;
  const [name, setName] = useState(initialValue?.name ?? '');
  const [description, setDescription] = useState(
    initialValue?.description ?? '',
  );
  const [profession, setProfession] = useState(
    initialValue?.profession ?? '',
  );
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage.preview);
      }
    };
  }, [selectedImage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved = await onSubmit({
      name: name.trim(),
      description: description.trim(),
      profession: profession.trim(),
      ...(selectedImage ? { image: selectedImage.file } : {}),
      ...(removeImage ? { removeImage: true } : {}),
    });

    if (saved && !initialValue) {
      setName('');
      setDescription('');
      setProfession('');
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor={nameId}>
            Name
          </label>
          <Input
            autoComplete="name"
            id={nameId}
            maxLength={120}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Jordan Lee"
            required
            value={name}
          />
          <p className="text-right text-xs text-muted-foreground">
            {name.length}/120
          </p>
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor={professionId}
          >
            Role or profession <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            autoComplete="organization-title"
            id={professionId}
            maxLength={120}
            onChange={(event) => setProfession(event.target.value)}
            placeholder="e.g. Parent"
            value={profession}
          />
          <p className="text-right text-xs text-muted-foreground">
            {profession.length}/120
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium"
          htmlFor={descriptionId}
        >
          Testimonial
        </label>
        <textarea
          className="flex min-h-32 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          id={descriptionId}
          maxLength={1000}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Share their experience in their own words"
          required
          value={description}
        />
        <p className="text-right text-xs text-muted-foreground">
          {description.length}/1000
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium" htmlFor={imageId}>
          Portrait <span className="text-muted-foreground">(optional, JPG or PNG up to 5 MB)</span>
        </label>
        <Input
          accept="image/jpeg,image/png"
          disabled={pending}
          id={imageId}
          onChange={(event) => {
            const file = event.target.files?.[0];
            setSelectedImage(
              file
                ? { file, preview: URL.createObjectURL(file) }
                : null,
            );
            setRemoveImage(false);
          }}
          ref={fileInputRef}
          type="file"
        />
        {(selectedImage || (currentImageUrl && !removeImage && !selectedImage)) && (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={selectedImage ? 'Selected portrait preview' : 'Current portrait'}
              className="size-14 rounded-full border object-cover"
              src={selectedImage?.preview ?? currentImageUrl ?? ''}
            />
            <p className="text-sm text-muted-foreground">
              {selectedImage ? selectedImage.file.name : 'Current portrait'}
            </p>
            {selectedImage && (
              <Button
                aria-label="Remove selected portrait"
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
            Remove current portrait
          </label>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button disabled={pending} type="submit">
          {initialValue ? <Check aria-hidden="true" /> : <ImagePlus aria-hidden="true" />}
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
