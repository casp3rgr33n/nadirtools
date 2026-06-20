import { MetadataRoute } from "next";
import toolConstants from "../../../config/tool-constants.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.nadirtools.com";
  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  const tools = (toolConstants as any).tools;

  Object.keys(tools).forEach((toolKey) => {
    // Parent tool route: /tools/[toolSlug]
    sitemapEntries.push({
      url: `${baseUrl}/tools/${toolKey}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // Child guide routes: /tools/[toolSlug]/[guideSlug]
    const guides = tools[toolKey].guides || {};
    Object.keys(guides).forEach((guideKey) => {
      sitemapEntries.push({
        url: `${baseUrl}/tools/${toolKey}/${guideKey}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    });
  });

  return sitemapEntries;
}
