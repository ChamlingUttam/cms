"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/types";

const SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

const controlClass =
  "absolute z-10 flex size-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white backdrop-blur hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-30";

/**
 * Photo grid. Clicking a photo opens it full size in a lightbox built on the
 * native <dialog> element: Esc closes it, the arrow keys move between photos,
 * and focus returns to the photo you opened.
 */
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<number | null>(null);

  const open = current !== null;
  const image = open ? images[current] : null;

  // Show / hide the native dialog when `current` changes.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Stop the page behind the lightbox from scrolling.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const go = (step: number) =>
    setCurrent((index) =>
      index === null ? index : Math.min(images.length - 1, Math.max(0, index + step)),
    );

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Open photo ${index + 1} of ${images.length}`}
              className="bg-sand group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                srcSet={item.srcSet ?? undefined}
                sizes={SIZES}
                alt={item.alt}
                loading={index < 3 ? "eager" : "lazy"}
                decoding="async"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onClose={() => setCurrent(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") go(1);
          if (event.key === "ArrowLeft") go(-1);
        }}
        className="m-0 size-full max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/90"
      >
        {image && (
          <div
            className="relative flex size-full items-center justify-center p-4 sm:p-12"
            onClick={(event) => {
              // A click on the dark area around the photo (not the photo or a button) closes it.
              if (event.target === event.currentTarget) setCurrent(null);
            }}
          >
            <button
              type="button"
              onClick={() => setCurrent(null)}
              aria-label="Close photo viewer"
              className={`${controlClass} top-4 right-4`}
            >
              ×
            </button>
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={current === 0}
              aria-label="Previous photo"
              className={`${controlClass} top-1/2 left-2 -translate-y-1/2 sm:left-4`}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={current === images.length - 1}
              aria-label="Next photo"
              className={`${controlClass} top-1/2 right-2 -translate-y-1/2 sm:right-4`}
            >
              ›
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={image.id}
              src={image.imageUrl}
              srcSet={image.srcSet ?? undefined}
              sizes="100vw"
              alt={image.alt}
              className="max-h-full max-w-full object-contain"
            />
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/80">
              {(current ?? 0) + 1} / {images.length}
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
