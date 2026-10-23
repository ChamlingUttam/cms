'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteGalleryImage,
  getGallery,
  uploadGalleryImages,
} from '@/service/gallery-service';

export const galleryQueryKeys = {
  all: ['admin', 'gallery'] as const,
  list: (page: number, from?: string, to?: string) =>
    [...galleryQueryKeys.all, { page, from, to }] as const,
};

export function useGallery(
  page: number,
  from?: string,
  to?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: galleryQueryKeys.list(page, from, to),
    queryFn: () => getGallery(page, from, to),
    enabled,
    retry: false,
  });
}

export function useUploadGalleryImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      files,
      onProgress,
    }: {
      files: File[];
      onProgress: (progress: number) => void;
    }) => uploadGalleryImages(files, onProgress),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: galleryQueryKeys.all }),
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: galleryQueryKeys.all }),
  });
}
