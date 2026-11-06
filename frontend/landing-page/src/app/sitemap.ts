import type { MetadataRoute } from "next";
import { navItems } from "@/data/navigation";
import { getAllBlogs } from "@/lib/api";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = navItems.map((item) => ({
    url: absoluteUrl(item.href),
    changeFrequency: (item.href === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));

  const blogs = await getAllBlogs();
  const articles = blogs.map((blog) => ({
    url: absoluteUrl(`/blog/${blog.slug}`),
    lastModified: blog.updatedAt || blog.createdAt || undefined,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...pages, ...articles];
}
