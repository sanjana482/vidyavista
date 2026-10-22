// Small client for the Django REST backend. Set NEXT_PUBLIC_API_URL in .env.local
// (e.g. http://localhost:8000/api, or https://your-app.up.railway.app/api in production).
import { readPreference } from "./preferences";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/$/, "");

export type EnquiryInput = {
  schoolName: string;
  schoolId?: number;
  childName?: string;
  className?: string;
  session?: string;
  parentName: string;
  relation?: string;
  mobile: string;
  email?: string;
  city?: string;
  note?: string;
};

export async function postEnquiry(data: EnquiryInput): Promise<{ ok: boolean }> {
  const pref = readPreference();
  const res = await fetch(`${API_URL}/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      source: typeof window !== "undefined" ? window.location.pathname : "",
      preference: pref ?? undefined,
    }),
  });
  if (!res.ok) throw new Error(`Enquiry failed (${res.status})`);
  return { ok: true };
}
