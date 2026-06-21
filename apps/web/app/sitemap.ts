import { MetadataRoute } from "next";
import toolConstants from "../../../config/tool-constants.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nadirtools.com";
  const tools = (toolConstants as any).tools;

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date("2026-06-19T22:30:00Z"),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  Object.keys(tools).forEach((toolKey) => {
    const tool = tools[toolKey];

    // Parent tool page — uses publishedAt from config
    sitemapEntries.push({
      url: `${baseUrl}/tools/${toolKey}`,
      lastModified: new Date(tool.publishedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // Guide sub-pages — reference content, changes monthly
    const guides = tool.guides || {};
    Object.keys(guides).forEach((guideKey) => {
      const guide = guides[guideKey];
      sitemapEntries.push({
        url: `${baseUrl}/tools/${toolKey}/${guideKey}`,
        lastModified: new Date(guide.publishedAt),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });
  });

  return sitemapEntries;
}
