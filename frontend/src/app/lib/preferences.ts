// Cookie based user preference (school type + city/state).
// Cookie name: vv_pref  |  value: URL-encoded JSON  |  expiry: 1 year
//
// Flow:
//   1. First visit  -> no cookie -> DEFAULT_PREF (Boarding Schools)
//   2. User picks type + city/state -> savePreference() writes the cookie
//   3. Refresh / close & reopen / come back to Home or /schools -> readPreference()
//      returns the saved values, so everything is pre-selected.

export type SchoolTypeLabel = "Day Schools" | "Boarding Schools" | "Day - Boarding";

export type Preference = {
  type: SchoolTypeLabel;
  /** City for Day / Day-Boarding, State for Boarding. Empty string = not chosen yet. */
  location: string;
};

export const COOKIE_NAME = "vv_pref";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const DEFAULT_PREF: Preference = { type: "Boarding Schools", location: "" };

const VALID_TYPES: SchoolTypeLabel[] = ["Day Schools", "Boarding Schools", "Day - Boarding"];

export const isBoardingType = (t: string) => t === "Boarding Schools";

export function readPreference(): Preference | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!raw) return null;
  try {
    const data = JSON.parse(decodeURIComponent(raw.slice(COOKIE_NAME.length + 1)));
    if (!VALID_TYPES.includes(data?.type)) return null;
    return {
      type: data.type,
      location: typeof data.location === "string" ? data.location.slice(0, 60) : "",
    };
  } catch {
    return null;
  }
}

export function savePreference(pref: Preference) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(pref))}` +
    `; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

export function clearPreference() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
}

// ---- helpers used by Hero / listing so both pages speak the same language ----

/** Hero labels ("Day Schools") and URL values -> the values stored in school data ("Day School"). */
export function normalizeType(t: string): "Day" | "Day Boarding" | "Full Boarding" | "" {
  const v = t.trim().toLowerCase();
  if (["day", "day schools", "day school"].includes(v)) return "Day";
  if (["full boarding", "full-boarding", "boarding schools", "boarding school"].includes(v)) return "Full Boarding";
  if (["day boarding", "day-boarding", "day - boarding", "day + boarding", "day + boarding schools"].includes(v)) return "Day Boarding";
  return "";
}

/** School data value -> Hero label (used when listing filters are saved back to the cookie). */
export function toHeroType(t: string): SchoolTypeLabel {
  if (t === "Full Boarding") return "Boarding Schools";
  if (t === "Day Boarding") return "Day - Boarding";
  return "Day Schools";
}
