// Loads schools from the Django API (the ones managed in the Django admin panel).
// Server pages call these with ISR: a new school shows up on the site within ~60 seconds.
import { API_URL } from "./api";
import type { School } from "../data/schools";

type ApiSchool = Partial<School> & { schoolId: number; name: string; area: string; city: string; state?: string };

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80";

export const mapSchool = (d: ApiSchool): School => ({
  id: d.schoolId,
  name: d.name,
  area: d.area,
  city: d.city,
  state: d.state,
  board: d.board as School["board"],
  grades: d.grades ?? "",
  type: d.type as School["type"],
  gender: (d.gender ?? "Co-ed") as School["gender"],
  rating: d.rating ?? 0,
  reviews: d.reviews ?? 0,
  fee: d.fee ?? 0,
  facilities: d.facilities ?? [],
  photos: d.photos ?? 0,
  topRated: !!d.topRated,
  phone: d.phone ?? "",
  image: d.image || FALLBACK_IMAGE,
});

const REVALIDATE = 60;

async function get(path: string) {
  try {
    return await fetch(`${API_URL}${path}`, { next: { revalidate: REVALIDATE } });
  } catch {
    throw new Error(`Cannot reach the API at ${API_URL}. Is the Django backend running? (set NEXT_PUBLIC_API_URL)`);
  }
}

/** every active school (the API returns max 50 per page, so we page through) */
export async function fetchAllSchools(): Promise<School[]> {
  const out: School[] = [];
  let page = 1;
  let pages = 1;
  do {
    const res = await get(`/schools?limit=50&page=${page}`);
    if (!res.ok) throw new Error(`Schools API failed (${res.status})`);
    const json = await res.json();
    out.push(...(json.data as ApiSchool[]).map(mapSchool));
    pages = json.meta?.pages ?? 1;
    page++;
  } while (page <= pages && page <= 40);
  return out;
}

/** same as above but never throws - for generateStaticParams / sitemap during a build without backend */
export async function fetchAllSchoolsSafe(): Promise<School[]> {
  try {
    return await fetchAllSchools();
  } catch (e) {
    console.warn("[schools] " + (e instanceof Error ? e.message : e));
    return [];
  }
}

export async function fetchSchool(id: number): Promise<School | undefined> {
  const res = await get(`/schools/${id}`);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`School API failed (${res.status})`);
  return mapSchool((await res.json()).data);
}
