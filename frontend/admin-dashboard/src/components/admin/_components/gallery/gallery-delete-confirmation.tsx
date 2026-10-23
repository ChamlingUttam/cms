'use client';

import { Dialog } from '@base-ui/react/dialog';
import { Button } from '@/components/ui/button';
import type { GalleryImage } from '@/types/gallery';
import { formatImageDate } from './gallery-utils';

interface GalleryDeleteConfirmationProps {
  image: GalleryImage | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function GalleryDeleteConfirmation({
  image,
  deleting,
  onCancel,
  onConfirm,
}: GalleryDeleteConfirmationProps) {
  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (!open && !deleting) {
          onCancel();
        }
      }}
      open={image !== null}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px] data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-6 shadow-xl outline-none">
          <Dialog.Title className="text-lg font-semibold">
            Delete this photo?
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">
            Are you sure you want to delete this photo? This action cannot be
            undone.
            {image && (
              <span className="mt-2 block truncate font-medium text-foreground">
                Uploaded {formatImageDate(image.createdAt)}
              </span>
            )}
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              disabled={deleting}
              onClick={onCancel}
              type="button"
              variant="outline"
            >
              No, keep photo
            </Button>
            <Button
              disabled={!image || deleting}
              onClick={onConfirm}
              type="button"
              variant="destructive"
            >
              {deleting ? 'Deleting…' : 'Yes, delete photo'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
