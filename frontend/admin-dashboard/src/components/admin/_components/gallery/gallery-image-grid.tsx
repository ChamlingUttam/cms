import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { GalleryImage } from '@/types/gallery';
import { formatBytes, formatImageDate } from './gallery-utils';

interface GalleryImageGridProps {
  images: GalleryImage[];
  deletingImageId: string | null;
  onPreview: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
}

export function GalleryImageGrid({
  images,
  deletingImageId,
  onPreview,
  onDelete,
}: GalleryImageGridProps) {
  return (
    <div
      aria-label="Gallery images"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {images.map((image) => (
        <article
          className="overflow-hidden rounded-xl border bg-card"
          key={image.id}
        >
          <button
            aria-label={`Preview image uploaded ${formatImageDate(image.createdAt)}`}
            className="block aspect-square w-full overflow-hidden bg-muted"
            onClick={() => onPreview(image)}
            type="button"
          >
            <picture>
              <source
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                srcSet={image.srcSet}
              />
              <Image
                alt={`Gallery image uploaded ${formatImageDate(image.createdAt)}`}
                className="size-full object-cover transition-transform hover:scale-105"
                height={image.height}
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                src={image.imageUrl}
                unoptimized
                width={image.width}
              />
            </picture>
          </button>
          <div className="flex items-center justify-between gap-2 p-3">
            <p className="min-w-0 text-xs text-muted-foreground">
              <time dateTime={image.createdAt}>
                {formatImageDate(image.createdAt)}
              </time>
              <span className="block">
                {image.format.toUpperCase()} · {image.width} × {image.height} ·{' '}
                {formatBytes(image.bytes)}
              </span>
            </p>
            <Button
              aria-label={`Delete image uploaded ${formatImageDate(image.createdAt)}`}
              disabled={deletingImageId !== null}
              onClick={() => onDelete(image)}
              size="sm"
              variant="destructive"
            >
              {deletingImageId === image.id ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
