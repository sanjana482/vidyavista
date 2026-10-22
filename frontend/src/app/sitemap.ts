import type { MetadataRoute } from "next";
import { citiesOf } from "./data/schools";
import { fetchAllSchoolsSafe } from "./lib/schoolsApi";
import { SITE_URL, cityPath, schoolPath } from "./lib/seo";

// Auto-generated at /sitemap.xml from the live schools in the database.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const schools = await fetchAllSchoolsSafe();
  const CITIES = citiesOf(schools);
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/schools`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...CITIES.map((c) => ({
      url: `${SITE_URL}${cityPath(c)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...schools.map((s) => ({
      url: `${SITE_URL}${schoolPath(s)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
