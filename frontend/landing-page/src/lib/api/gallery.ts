import { cacheLife, cacheTag } from "next/cache";
import { dummyGallery } from "@/data/gallery";
import type { GalleryImage, GalleryList, Pagination } from "@/types";
import { failedLife } from "./cache";
import { apiGet } from "./client";
import { isApiConfigured, showDummyContent } from "./config";
import { endpoints } from "./endpoints";
import { logApiFailure } from "./log";

interface GalleryResponse {
  success?: boolean;
  data?: { images?: Partial<GalleryImage>[]; pagination?: Partial<Pagination> };
}

/** Keeps only what the site uses, and drops records without an image. */
function toImage(item: Partial<GalleryImage>): GalleryImage | null {
  if (!item.id || !item.imageUrl) return null;

  return {
    id: item.id,
    imageUrl: item.imageUrl,
    srcSet: item.srcSet ?? null,
    alt: item.alt ?? "",
    createdAt: item.createdAt ?? "",
  };
}

const emptyList = (page: number): GalleryList => ({
  images: [],
  pagination: { page, limit: 0, totalItems: 0, totalPages: 0 },
});

/**
 * One page of gallery images. The backend decides the page size, so only
 * `page` is sent. Cached and refreshed in the background about once a minute.
 */
async function fetchGallery(page: number): Promise<GalleryList> {
  "use cache";
  cacheTag("gallery");

  if (!isApiConfigured) {
    cacheLife("minutes");
    return emptyList(page);
  }

  try {
    const json = await apiGet<GalleryResponse>(
      `${endpoints.gallery}?page=${page}`
    );
    cacheLife("minutes");

    const images = (json.data?.images ?? []).flatMap((item) => {
      const image = toImage(item);
      return image ? [image] : [];
    });
    const pagination = json.data?.pagination;

    return {
      images,
      pagination: {
        page: pagination?.page ?? page,
        limit: pagination?.limit ?? images.length,
        totalItems: pagination?.totalItems ?? images.length,
        totalPages: pagination?.totalPages ?? (images.length > 0 ? 1 : 0),
      },
    };
  } catch (error) {
    cacheLife(failedLife);
    logApiFailure("gallery", error);
    return emptyList(page);
  }
}

/**
 * One page of gallery images, as ordered by the backend.
 * With no images at all, page 1 shows the dummy images outside production.
 */
export async function getGallery(page = 1): Promise<GalleryList> {
  const list = await fetchGallery(page);
  if (list.images.length > 0 || page !== 1 || !showDummyContent) return list;

  return {
    images: dummyGallery,
    pagination: {
      page: 1,
      limit: dummyGallery.length,
      totalItems: dummyGallery.length,
      totalPages: 1,
    },
  };
}
