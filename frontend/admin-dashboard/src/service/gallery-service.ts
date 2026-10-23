import { apiClient } from '@/api/client';
import { galleryEndpoints } from '@/api-endpoints/gallery';
import type { ApiResponse } from '@/types/auth';
import type {
  GalleryImage,
  GalleryList,
  GalleryUploadResult,
} from '@/types/gallery';

export async function getGallery(
  page: number,
  from?: string,
  to?: string,
): Promise<GalleryList> {
  const { data } = await apiClient.get<ApiResponse<GalleryList>>(
    galleryEndpoints.list,
    {
      params: {
        page,
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
      },
    },
  );
  return data.data;
}

export async function uploadGalleryImages(
  files: File[],
  onProgress: (progress: number) => void,
): Promise<GalleryUploadResult[]> {
  const form = new FormData();
  files.forEach((file) => form.append('images', file));

  const { data } = await apiClient.post<
    ApiResponse<{ results: GalleryUploadResult[] }>
  >(galleryEndpoints.list, form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (event) => {
      if (event.total) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });

  return data.data.results;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await apiClient.delete(galleryEndpoints.byId(id));
}

export type { GalleryImage };
