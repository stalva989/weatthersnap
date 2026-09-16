import type { MetadataRoute } from "next";
import { learnArticles } from "@/lib/learnArticles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://weathersnap.app";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/report-preview`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const learnPages: MetadataRoute.Sitemap =
    learnArticles.map((article) => ({
      url: `${baseUrl}/learn/${article.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [...staticPages, ...learnPages];
}