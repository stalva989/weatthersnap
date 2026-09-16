import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/success",
      ],
    },

    sitemap: "https://weathersnap.app/sitemap.xml",
    host: "https://weathersnap.app",
  };
}