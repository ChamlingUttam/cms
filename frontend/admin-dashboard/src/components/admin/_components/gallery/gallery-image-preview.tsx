import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { GalleryImage } from '@/types/gallery';
import { formatImageDate } from './gallery-utils';

interface GalleryImagePreviewProps {
  image: GalleryImage;
  position: number;
  total: number;
  navigationBusy: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function GalleryImagePreview({
  image,
  position,
  total,
  navigationBusy,
  onClose,
  onPrevious,
  onNext,
}: GalleryImagePreviewProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <section
        aria-labelledby="gallery-preview-title"
        aria-modal="true"
        className="relative w-full max-w-4xl rounded-xl bg-background p-4 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium" id="gallery-preview-title">
            Image {position} of {total}
          </h2>
          <Button onClick={onClose} type="button" variant="outline">
            Close preview
          </Button>
        </div>
        <Image
          alt={`Gallery image uploaded ${formatImageDate(image.createdAt)}`}
          className="mx-auto max-h-[70vh] w-full object-contain"
          height={image.height}
          src={image.imageUrl}
          unoptimized
          width={image.width}
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <Button
            disabled={position <= 1 || navigationBusy}
            onClick={onPrevious}
            variant="outline"
          >
            Previous image
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {formatImageDate(image.createdAt)}
          </p>
          <Button
            disabled={position >= total || navigationBusy}
            onClick={onNext}
            variant="outline"
          >
            Next image
          </Button>
        </div>
      </section>
    </div>
  );
}
