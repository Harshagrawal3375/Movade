import type { MetadataRoute } from "next";
import { getStore } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const staticRoutes = [
    "",
    "/about",
    "/blog",
    "/contact",
    "/destinations",
    "/experiences",
    "/properties",
    "/booking",
    "/privacy",
    "/terms",
    "/help",
  ].map((p) => ({ url: `${base}${p || "/"}`, lastModified: new Date() }));

  try {
    const store = await getStore();
    const dynamic = [
      ...store.destinations.map((d) => ({
        url: `${base}/destinations/${d.slug}`,
        lastModified: new Date(),
      })),
      ...store.blogs.map((b) => ({
        url: `${base}/blog/${b.slug}`,
        lastModified: new Date(),
      })),
    ];
    return [...staticRoutes, ...dynamic];
  } catch {
    return staticRoutes;
  }
}
