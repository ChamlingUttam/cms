import type { GalleryImage } from "@/types";

/**
 * DUMMY CONTENT. Shown only in development (or when SHOW_DUMMY_CONTENT=true)
 * while the admin dashboard has no gallery images or the API is unreachable.
 * The files live in /public/gallery.
 */
const dummy = (id: number, alt: string): GalleryImage => ({
  id: `dummy-gallery-${id}`,
  imageUrl: `/gallery/dummy-${id}.jpg`,
  srcSet: null,
  alt,
  createdAt: "",
});

export const dummyGallery: GalleryImage[] = [
  dummy(1, "Students gathered for morning assembly in front of the main building"),
  dummy(2, "Science lab with flasks and test tubes on the bench"),
  dummy(3, "Library shelves full of colourful books"),
  dummy(4, "Art studio palette with bright paints and a brush"),
  dummy(5, "Football flying over the running track on sports day"),
  dummy(6, "Music room with notes on a stave and a drum"),
  dummy(7, "Garden club flowers growing in the school garden"),
  dummy(8, "Interlocking gears from the robotics club"),
  dummy(9, "Graduation cap at the end-of-year ceremony"),
];
