import type { School } from "../data/schools";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.vidyavista.com").replace(/\/$/, "");
export const SITE_NAME = "VidyaVista";

export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** SEO friendly path: /schools/maplewood-academy-whitefield-bengaluru-1  (id is always last) */
export const schoolSlug = (s: School) => `${slugify(`${s.name} ${s.area} ${s.city}`)}-${s.id}`;
export const schoolPath = (s: School) => `/schools/${schoolSlug(s)}`;

/** Accepts "1" or "maplewood-academy-whitefield-bengaluru-1" and returns the numeric id. */
export function idFromParam(param: string): string {
  const m = param.match(/(\d+)$/);
  return m ? m[1] : param;
}

export const cityPath = (city: string) => `/schools-in/${slugify(city)}`;

export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
