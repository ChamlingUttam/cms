export interface GalleryImage {
  id: string;
  imageUrl: string;
  srcSet: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
}

export interface GalleryPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface GalleryList {
  images: GalleryImage[];
  pagination: GalleryPagination;
}

export type GalleryUploadResult =
  | {
      index: number;
      filename: string;
      success: true;
      image: GalleryImage;
    }
  | {
      index: number;
      filename: string;
      success: false;
      message: string;
    };
