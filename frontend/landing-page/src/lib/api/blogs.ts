// import { cacheLife, cacheTag } from "next/cache";
// import { dummyBlogs } from "@/data/blog";
// import type { Blog, BlogList, BlogPagination } from "@/types";
// import { ApiError, apiGet } from "./client";
// import { isApiConfigured, showDummyContent } from "./config";
// import { endpoints } from "./endpoints";

// interface BlogsResponse {
//   success?: boolean;
//   data?: { blogs?: Partial<Blog>[]; pagination?: Partial<BlogPagination> };
// }

// interface BlogResponse {
//   success?: boolean;
//   data?: { blog?: Partial<Blog> };
// }

// /** Keeps only the fields the site uses, and drops records that are unusable. */
// function toBlog(item: Partial<Blog>): Blog | null {
//   if (!item.id || !item.name || !item.slug || !item.longDescription)
//     return null;

//   return {
//     id: item.id,
//     name: item.name,
//     slug: item.slug,
//     shortDescription: item.shortDescription ?? "",
//     longDescription: item.longDescription,
//     imageUrl: item.imageUrl ?? null,
//     srcSet: item.srcSet ?? null,
//     createdAt: item.createdAt ?? "",
//     updatedAt: item.updatedAt ?? item.createdAt ?? "",
//   };
// }

// const emptyList = (page: number, limit: number): BlogList => ({
//   blogs: [],
//   pagination: { page, limit, totalItems: 0, totalPages: 0 },
// });

// /**
//  * One page of blogs. Cached and refreshed in the background about once a
//  * minute. Throws on failure on purpose: a thrown error is never cached.
//  */
// async function loadBlogs(page: number, limit: number): Promise<BlogList> {
//   "use cache";
//   cacheTag("blogs");
//   cacheLife("minutes");

//   const json = await apiGet<BlogsResponse>(
//     `${endpoints.blogs}?page=${page}&limit=${limit}`
//   );
//   const blogs = (json.data?.blogs ?? []).flatMap((item) => {
//     const blog = toBlog(item);
//     return blog ? [blog] : [];
//   });
//   const pagination = json.data?.pagination;

//   return {
//     blogs,
//     pagination: {
//       page: pagination?.page ?? page,
//       limit: pagination?.limit ?? limit,
//       totalItems: pagination?.totalItems ?? blogs.length,
//       totalPages: pagination?.totalPages ?? (blogs.length > 0 ? 1 : 0),
//     },
//   };
// }

// async function fetchBlogs(page: number, limit: number): Promise<BlogList> {
//   if (!isApiConfigured) return emptyList(page, limit);

//   try {
//     return await loadBlogs(page, limit);
//   } catch (error) {
//     console.error("[blogs] could not load blogs:", error);
//     return emptyList(page, limit);
//   }
// }

// /** A single blog by slug. Throws on failure (including 404); never cached when it throws. */
// async function loadBlog(slug: string): Promise<Blog | null> {
//   "use cache";
//   cacheTag("blogs");
//   cacheLife("minutes");

//   const json = await apiGet<BlogResponse>(endpoints.blog(slug));
//   return json.data?.blog ? toBlog(json.data.blog) : null;
// }

// /** A single blog by slug, or null if it does not exist. */
// async function fetchBlog(slug: string): Promise<Blog | null> {
//   if (!isApiConfigured) return null;

//   try {
//     return await loadBlog(slug);
//   } catch (error) {
//     if (!(error instanceof ApiError && error.status === 404)) {
//       console.error(`[blogs] could not load blog "${slug}":`, error);
//     }
//     return null;
//   }
// }

// /**
//  * One page of blogs, newest first (as the backend orders them).
//  * With no blogs at all, page 1 shows the dummy blogs outside production.
//  */
// export async function getBlogs(page = 1, limit = 9): Promise<BlogList> {
//   const list = await fetchBlogs(page, limit);
//   if (list.blogs.length > 0 || page !== 1 || !showDummyContent) return list;

//   const blogs = dummyBlogs.slice(0, limit);
//   return {
//     blogs,
//     pagination: {
//       page: 1,
//       limit,
//       totalItems: dummyBlogs.length,
//       totalPages: Math.ceil(dummyBlogs.length / limit),
//     },
//   };
// }

// export async function getBlog(slug: string): Promise<Blog | null> {
//   const blog = await fetchBlog(slug);
//   if (blog) return blog;
//   return showDummyContent
//     ? dummyBlogs.find((item) => item.slug === slug) ?? null
//     : null;
// }

// /** Every blog (capped at 300), for the sitemap and for pre-building post pages. */
// export async function getAllBlogs(): Promise<Blog[]> {
//   const first = await getBlogs(1, 12);
//   const all = [...first.blogs];
//   const lastPage = Math.min(first.pagination.totalPages, 25);

//   for (let page = 2; page <= lastPage; page++) {
//     all.push(...(await getBlogs(page, 12)).blogs);
//   }
//   return all;
// }

import { cacheLife, cacheTag } from "next/cache";
import { dummyBlogs } from "@/data/blog";
import type { Blog, BlogList, BlogPagination } from "@/types";
import { failedLife } from "./cache";
import { ApiError, apiGet } from "./client";
import { isApiConfigured, showDummyContent } from "./config";
import { endpoints } from "./endpoints";

interface BlogsResponse {
  success?: boolean;
  data?: { blogs?: Partial<Blog>[]; pagination?: Partial<BlogPagination> };
}

interface BlogResponse {
  success?: boolean;
  data?: { blog?: Partial<Blog> };
}

/** Keeps only the fields the site uses, and drops records that are unusable. */
function toBlog(item: Partial<Blog>): Blog | null {
  if (!item.id || !item.name || !item.slug || !item.longDescription)
    return null;

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    shortDescription: item.shortDescription ?? "",
    longDescription: item.longDescription,
    imageUrl: item.imageUrl ?? null,
    srcSet: item.srcSet ?? null,
    createdAt: item.createdAt ?? "",
    updatedAt: item.updatedAt ?? item.createdAt ?? "",
  };
}

const emptyList = (page: number, limit: number): BlogList => ({
  blogs: [],
  pagination: { page, limit, totalItems: 0, totalPages: 0 },
});

/** One page of blogs. Cached and refreshed in the background about once a minute. */
async function fetchBlogs(page: number, limit: number): Promise<BlogList> {
  "use cache";
  cacheTag("blogs");

  if (!isApiConfigured) {
    cacheLife("minutes");
    return emptyList(page, limit);
  }

  try {
    const json = await apiGet<BlogsResponse>(
      `${endpoints.blogs}?page=${page}&limit=${limit}`
    );
    cacheLife("minutes");

    const blogs = (json.data?.blogs ?? []).flatMap((item) => {
      const blog = toBlog(item);
      return blog ? [blog] : [];
    });
    const pagination = json.data?.pagination;

    return {
      blogs,
      pagination: {
        page: pagination?.page ?? page,
        limit: pagination?.limit ?? limit,
        totalItems: pagination?.totalItems ?? blogs.length,
        totalPages: pagination?.totalPages ?? (blogs.length > 0 ? 1 : 0),
      },
    };
  } catch (error) {
    cacheLife(failedLife);
    console.error("[blogs] could not load blogs:", error);
    return emptyList(page, limit);
  }
}

/** A single blog by slug, or null if it does not exist. */
async function fetchBlog(slug: string): Promise<Blog | null> {
  "use cache";
  cacheTag("blogs");

  if (!isApiConfigured) {
    cacheLife("minutes");
    return null;
  }

  try {
    const json = await apiGet<BlogResponse>(endpoints.blog(slug));
    cacheLife("minutes");
    return json.data?.blog ? toBlog(json.data.blog) : null;
  } catch (error) {
    // A 404 is a normal answer ("no such post"), so it is cached like one.
    if (error instanceof ApiError && error.status === 404) {
      cacheLife("minutes");
    } else {
      cacheLife(failedLife);
      console.error(`[blogs] could not load blog "${slug}":`, error);
    }
    return null;
  }
}

/**
 * One page of blogs, newest first (as the backend orders them).
 * With no blogs at all, page 1 shows the dummy blogs outside production.
 */
export async function getBlogs(page = 1, limit = 9): Promise<BlogList> {
  const list = await fetchBlogs(page, limit);
  if (list.blogs.length > 0 || page !== 1 || !showDummyContent) return list;

  const blogs = dummyBlogs.slice(0, limit);
  return {
    blogs,
    pagination: {
      page: 1,
      limit,
      totalItems: dummyBlogs.length,
      totalPages: Math.ceil(dummyBlogs.length / limit),
    },
  };
}

export async function getBlog(slug: string): Promise<Blog | null> {
  const blog = await fetchBlog(slug);
  if (blog) return blog;
  return showDummyContent
    ? dummyBlogs.find((item) => item.slug === slug) ?? null
    : null;
}

/** Every blog (capped at 300), for the sitemap and for pre-building post pages. */
export async function getAllBlogs(): Promise<Blog[]> {
  const first = await getBlogs(1, 12);
  const all = [...first.blogs];
  const lastPage = Math.min(first.pagination.totalPages, 25);

  for (let page = 2; page <= lastPage; page++) {
    all.push(...(await getBlogs(page, 12)).blogs);
  }
  return all;
}
