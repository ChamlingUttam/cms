'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  GalleryImageGrid,
  GalleryDeleteConfirmation,
  GalleryImagePreview,
  GalleryPagination,
  GalleryToolbar,
  GalleryUploadPanel,
  getKathmanduDate,
  shiftDate,
  type DateFilter,
} from '@/components/admin/_components/gallery';
import { ManagementLoadError } from '@/components/admin/_components/management-load-error';
import { ManagementPageHeader } from '@/components/admin/_components/management-page-header';
import { ManagementSkeleton } from '@/components/admin/_components/management-skeleton';
import {
  galleryQueryKeys,
  useDeleteGalleryImage,
  useGallery,
} from '@/hooks/use-gallery';
import { getApiErrorMessage } from '@/lib/api-error';
import { getGallery } from '@/service/gallery-service';
import type { GalleryImage } from '@/types/gallery';

const emptyGalleryImages: GalleryImage[] = [];

export function GalleryManager() {
  const [filter, setFilter] = useState<DateFilter>('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [page, setPage] = useState(1);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
  const [previewPosition, setPreviewPosition] = useState<number | null>(null);
  const [previewNavigationBusy, setPreviewNavigationBusy] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [pendingDeleteImage, setPendingDeleteImage] =
    useState<GalleryImage | null>(null);
  const [today, setToday] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setToday(getKathmanduDate(new Date()));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const hasCustomRange = Boolean(customFrom && customTo);
  const rangeIsReady = filter !== 'custom' || hasCustomRange;
  const needsToday =
    filter === 'today' || filter === 'week' || filter === 'month';
  const queryIsReady = rangeIsReady && (!needsToday || today !== null);
  const from =
    filter === 'today'
      ? (today ?? undefined)
      : filter === 'week' && today
        ? shiftDate(today, -6)
        : filter === 'month' && today
          ? shiftDate(today, -29)
          : filter === 'custom' && hasCustomRange
            ? customFrom
            : undefined;
  const to =
    filter === 'today' || filter === 'week' || filter === 'month'
      ? (today ?? undefined)
      : filter === 'custom' && hasCustomRange
        ? customTo
        : undefined;
  const galleryQuery = useGallery(page, from, to, queryIsReady);
  const deleteMutation = useDeleteGalleryImage();
  const images = galleryQuery.data?.images ?? emptyGalleryImages;
  const pagination = galleryQuery.data?.pagination;

  const navigatePreview = useCallback(
    async (direction: -1 | 1) => {
      if (
        !previewImage ||
        previewPosition === null ||
        !pagination ||
        previewNavigationBusy
      ) {
        return;
      }

      const nextPosition = previewPosition + direction;
      if (nextPosition < 1 || nextPosition > pagination.totalItems) {
        return;
      }

      const targetPage =
        Math.floor((nextPosition - 1) / pagination.limit) + 1;
      const targetIndex =
        nextPosition - 1 - (targetPage - 1) * pagination.limit;

      if (targetPage === page && images[targetIndex]) {
        setPreviewImage(images[targetIndex]);
        setPreviewPosition(nextPosition);
        return;
      }

      setPreviewNavigationBusy(true);
      try {
        const targetGallery = await queryClient.fetchQuery({
          queryKey: galleryQueryKeys.list(targetPage, from, to),
          queryFn: () => getGallery(targetPage, from, to),
        });
        const targetImage = targetGallery.images[targetIndex];
        if (!targetImage) {
          throw new Error('The next gallery image could not be found.');
        }
        setPage(targetPage);
        setPreviewImage(targetImage);
        setPreviewPosition(nextPosition);
      } catch (error) {
        toast.error(
          getApiErrorMessage(error, 'Could not load the next gallery image.'),
        );
      } finally {
        setPreviewNavigationBusy(false);
      }
    },
    [
      from,
      images,
      page,
      pagination,
      previewImage,
      previewNavigationBusy,
      previewPosition,
      queryClient,
      to,
    ],
  );

  useEffect(() => {
    if (!previewImage) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setPreviewImage(null);
        setPreviewPosition(null);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        void navigatePreview(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        void navigatePreview(-1);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigatePreview, previewImage]);

  function changeFilter(nextFilter: DateFilter) {
    setPage(1);
    setPreviewImage(null);
    setPreviewPosition(null);
    setFilter(nextFilter);
  }

  function clearFilter() {
    setCustomFrom('');
    setCustomTo('');
    changeFilter('all');
  }

  function changeCustomFrom(value: string) {
    setPage(1);
    setPreviewImage(null);
    setPreviewPosition(null);
    setCustomFrom(value);
    if (customTo && value > customTo) {
      setCustomTo('');
    }
  }

  function changeCustomTo(value: string) {
    if (value && customFrom && value < customFrom) {
      return;
    }
    setPage(1);
    setPreviewImage(null);
    setPreviewPosition(null);
    setCustomTo(value);
  }

  async function handleDelete(image: GalleryImage) {
    setDeletingImageId(image.id);
    try {
      await deleteMutation.mutateAsync(image.id);
      setPendingDeleteImage(null);
      setPreviewImage(null);
      setPreviewPosition(null);
      if (images.length === 1 && page > 1) {
        setPage((current) => current - 1);
      }
      toast.success('Gallery image deleted.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not delete the image.'));
    } finally {
      setDeletingImageId(null);
    }
  }

  if (rangeIsReady && (!queryIsReady || (galleryQuery.isPending && !previewImage))) {
    return <ManagementSkeleton />;
  }

  if (queryIsReady && galleryQuery.isError && !previewImage) {
    return (
      <ManagementLoadError
        error={galleryQuery.error}
        onRetry={() => void galleryQuery.refetch()}
        title="Could not load gallery images"
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <ManagementPageHeader
        description="Upload and manage the images displayed in your website gallery."
        title="Gallery"
      />
      <GalleryUploadPanel
        onUploadSuccess={() => {
          setPage(1);
          setPreviewImage(null);
          setPreviewPosition(null);
        }}
      />
      <GalleryToolbar
        customFrom={customFrom}
        customTo={customTo}
        filter={filter}
        onClear={clearFilter}
        onCustomFromChange={changeCustomFrom}
        onCustomToChange={changeCustomTo}
        onFilterChange={changeFilter}
        pagination={queryIsReady ? pagination : undefined}
      />
      {!rangeIsReady ? (
        <p className="rounded-xl border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
          Choose both a start and end date to view images in that range.
        </p>
      ) : (
        <>
          {pagination && pagination.totalPages > 0 && (
            <p className="text-xs text-muted-foreground">
              Showing page {pagination.page} of {pagination.totalPages}
            </p>
          )}
          {images.length === 0 ? (
            <p className="rounded-xl border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
              {pagination?.totalItems === 0
                ? 'No gallery images match this date filter.'
                : 'There are no images on this page.'}
            </p>
          ) : (
            <GalleryImageGrid
              deletingImageId={deletingImageId}
              images={images}
              onDelete={setPendingDeleteImage}
              onPreview={(image) => {
                setPreviewImage(image);
                setPreviewPosition(
                  (page - 1) * (pagination?.limit ?? images.length) +
                    images.findIndex((item) => item.id === image.id) +
                    1,
                );
              }}
            />
          )}
          {pagination && (
            <GalleryPagination
              isFetching={galleryQuery.isFetching}
              onPageChange={(nextPage) => {
                setPage(nextPage);
                setPreviewImage(null);
                setPreviewPosition(null);
              }}
              page={page}
              pagination={pagination}
            />
          )}
          {previewImage && previewPosition !== null && pagination && (
            <GalleryImagePreview
              image={previewImage}
              navigationBusy={previewNavigationBusy}
              onClose={() => {
                setPreviewImage(null);
                setPreviewPosition(null);
              }}
              onNext={() => void navigatePreview(1)}
              onPrevious={() => void navigatePreview(-1)}
              position={previewPosition}
              total={pagination.totalItems}
            />
          )}
          <GalleryDeleteConfirmation
            deleting={deleteMutation.isPending}
            image={pendingDeleteImage}
            onCancel={() => setPendingDeleteImage(null)}
            onConfirm={() => {
              if (pendingDeleteImage) {
                void handleDelete(pendingDeleteImage);
              }
            }}
          />
        </>
      )}
    </div>
  );
}
