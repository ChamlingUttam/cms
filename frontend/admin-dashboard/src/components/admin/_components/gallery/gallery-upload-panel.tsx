'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useUploadGalleryImages } from '@/hooks/use-gallery';
import { getApiErrorMessage } from '@/lib/api-error';
import { formatBytes } from './gallery-utils';

const maximumImages = 10;
const maximumImageBytes = 5 * 1024 * 1024;
const acceptedImageTypes = new Set(['image/jpeg', 'image/jpg', 'image/png']);
const acceptedImageExtensions = /\.(jpe?g|png)$/i;

interface StagedImage {
  id: string;
  file: File;
  previewUrl: string | null;
  error?: string;
}

interface GalleryUploadPanelProps {
  onUploadSuccess: () => void;
}

function validateImage(file: File) {
  if (!acceptedImageTypes.has(file.type) || !acceptedImageExtensions.test(file.name)) {
    return 'Only JPG, JPEG, and PNG images are allowed.';
  }

  if (file.size > maximumImageBytes) {
    return 'This image exceeds the 5 MB per-image limit.';
  }

  return null;
}

export function GalleryUploadPanel({
  onUploadSuccess,
}: GalleryUploadPanelProps) {
  const [selectedImages, setSelectedImages] = useState<StagedImage[]>([]);
  const [selectionError, setSelectionError] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrls = useRef(new Set<string>());
  const uploadMutation = useUploadGalleryImages();
  const uploadableImages = selectedImages.filter((image) => !image.error);

  useEffect(
    () => () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current.clear();
    },
    [],
  );

  function removeImage(imageId: string) {
    const removed = selectedImages.find((image) => image.id === imageId);
    if (removed?.previewUrl) {
      URL.revokeObjectURL(removed.previewUrl);
      objectUrls.current.delete(removed.previewUrl);
    }
    setSelectedImages((current) =>
      current.filter((image) => image.id !== imageId),
    );
  }

  function selectImages(files: File[]) {
    setSelectionError('');
    if (files.length === 0) {
      return;
    }

    const availableSlots = maximumImages - selectedImages.length;
    const acceptedFiles = files.slice(0, availableSlots);
    const nextImages = acceptedFiles.map((file): StagedImage => {
      const error = validateImage(file);
      const previewUrl =
        !error && file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : null;
      if (previewUrl) {
        objectUrls.current.add(previewUrl);
      }
      return {
        id: crypto.randomUUID(),
        file,
        previewUrl,
        ...(error ? { error } : {}),
      };
    });

    setSelectedImages((current) => [...current, ...nextImages]);
    if (acceptedFiles.length < files.length) {
      setSelectionError(
        `You can select up to ${maximumImages} images at once. Remove an item to add another.`,
      );
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function uploadSelectedImages() {
    if (uploadableImages.length === 0) {
      return;
    }

    setSelectionError('');
    setUploadProgress(0);
    try {
      const results = await uploadMutation.mutateAsync({
        files: uploadableImages.map((image) => image.file),
        onProgress: setUploadProgress,
      });
      const resultByIndex = new Map(
        results.map((result) => [result.index, result]),
      );

      const successfulIds = new Set<string>();
      let uploadIndex = 0;
      const updatedImages = selectedImages.map((image) => {
        if (image.error) {
          return image;
        }

        const result = resultByIndex.get(uploadIndex);
        uploadIndex += 1;
        if (result?.success) {
          successfulIds.add(image.id);
          if (image.previewUrl) {
            URL.revokeObjectURL(image.previewUrl);
            objectUrls.current.delete(image.previewUrl);
          }
          return image;
        }
        return {
          ...image,
          error: result?.message ?? 'The image could not be uploaded.',
        };
      });
      setSelectedImages(
        updatedImages.filter((image) => !successfulIds.has(image.id)),
      );

      const successes = results.filter((result) => result.success).length;
      const failures = results.length - successes;
      if (successes > 0) {
        onUploadSuccess();
        toast.success(
          `${successes} ${successes === 1 ? 'image' : 'images'} uploaded.`,
        );
      }
      if (failures > 0) {
        toast.error(
          `${failures} ${failures === 1 ? 'image' : 'images'} failed. See the individual errors below.`,
        );
      }
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Could not upload gallery images.',
      );
      setSelectedImages((current) =>
        current.map((image) =>
          image.error ? image : { ...image, error: message },
        ),
      );
      toast.error(message);
    } finally {
      setUploadProgress(null);
    }
  }

  return (
    <section
      aria-labelledby="gallery-upload-title"
      className="space-y-4 rounded-xl border bg-card p-4 sm:p-5"
    >
      <div>
        <h2 className="font-semibold" id="gallery-upload-title">
          Upload photos
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You can upload up to 10 images at once. JPG, JPEG, and PNG only;
          maximum 5 MB per image.
        </p>
      </div>

      <div className="rounded-xl border border-dashed bg-muted/30 px-4 py-6 text-center sm:px-6">
        <ImagePlus
          aria-hidden="true"
          className="mx-auto size-8 text-muted-foreground"
        />
        <p className="mt-2 text-sm font-medium">
          Select photos from your device
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {selectedImages.length} of {maximumImages} selected
        </p>
        <input
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          aria-label="Select gallery photos"
          className="sr-only"
          disabled={uploadMutation.isPending}
          multiple
          onChange={(event) =>
            selectImages(Array.from(event.currentTarget.files ?? []))
          }
          ref={fileInputRef}
          type="file"
        />
        <Button
          className="mt-4"
          disabled={
            uploadMutation.isPending || selectedImages.length >= maximumImages
          }
          onClick={() => fileInputRef.current?.click()}
          type="button"
          variant="outline"
        >
          <Upload aria-hidden="true" />
          Choose photos
        </Button>
      </div>

      {selectionError && (
        <p className="text-sm text-destructive" role="alert">
          {selectionError}
        </p>
      )}

      {selectedImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-medium">Selected photos</h3>
            <div className="flex flex-wrap items-center gap-3">
              {uploadProgress !== null && (
                <div className="flex min-w-32 items-center gap-2">
                  <progress
                    aria-label="Image upload progress"
                    className="h-2 w-full accent-primary"
                    max={100}
                    value={uploadProgress}
                  />
                  <span className="text-xs tabular-nums">
                    {uploadProgress}%
                  </span>
                </div>
              )}
              <Button
                disabled={
                  uploadMutation.isPending || uploadableImages.length === 0
                }
                onClick={() => void uploadSelectedImages()}
                type="button"
              >
                Upload {uploadableImages.length} selected
              </Button>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selectedImages.map((image) => (
              <li
                className="flex min-w-0 items-center gap-3 rounded-lg border p-3"
                key={image.id}
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  {image.previewUrl && (
                    <Image
                      alt=""
                      className="object-cover"
                      fill
                      sizes="64px"
                      src={image.previewUrl}
                      unoptimized
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {image.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(image.file.size)}
                  </p>
                  {image.error && (
                    <p className="mt-1 text-xs text-destructive" role="alert">
                      {image.error}
                    </p>
                  )}
                </div>
                <Button
                  aria-label={`Remove ${image.file.name}`}
                  disabled={uploadMutation.isPending}
                  onClick={() => removeImage(image.id)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
