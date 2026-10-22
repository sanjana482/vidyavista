"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { School } from "../../data/schools";
import { openEnquiry } from "./enquiry";

type Props = {
  school: School;
  intro: string;
  phoneHref: string;
  stats: { label: string; value: string }[];
};

export default function ProfileHero({ school: s, intro, phoneHref, stats }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const list: number[] = JSON.parse(localStorage.getItem("vv_saved") || "[]");
      setSaved(list.includes(s.id));
    } catch {}
  }, [s.id]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  function toggleSave() {
    const next = !saved;
    setSaved(next);
    try {
      const list: number[] = JSON.parse(localStorage.getItem("vv_saved") || "[]");
      const updated = next ? Array.from(new Set([...list, s.id])) : list.filter((x) => x !== s.id);
      localStorage.setItem("vv_saved", JSON.stringify(updated));
    } catch {}
    flash(next ? "School saved" : "Removed from saved");
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: s.name, url });
      else {
        await navigator.clipboard.writeText(url);
        flash("Link copied");
      }
    } catch {}
  }

  const chip = "rounded-lg px-3.5 py-2 text-xs font-extrabold";
  const ghost =
    "inline-flex items-center gap-2 rounded-xl border border-[#D6DDE5] bg-white px-5 py-3.5 text-sm font-bold text-[#0B2A47] transition hover:border-[#0795DC] hover:text-[#0A7BBF]";

  return (
    <section className="bg-gradient-to-b from-[#F3F9FD] to-white">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-5 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 text-sm text-[#5C6A7B]">
          <Link href="/" className="hover:text-[#0A7BBF]">Home</Link>›
          <Link href="/schools" className="hover:text-[#0A7BBF]">Schools</Link>›
          <Link href={`/schools?city=${s.city}`} className="hover:text-[#0A7BBF]">{s.city}</Link>›
          <span className="text-[#0B2A47]">{s.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          {/* Photo */}
          <div className="relative h-72 overflow-hidden rounded-3xl bg-[#E1F1FA] shadow-xl shadow-[#0A5C91]/10 sm:h-96 lg:h-[475px]">
            <img src={s.image} alt={`${s.name} campus`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => document.getElementById("photos")?.scrollIntoView({ behavior: "smooth" })}
              className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-[#0B2A47] shadow-lg transition hover:bg-[#E1F1FA]"
            >
              📷 View photos
            </button>
          </div>

          {/* Summary */}
          <div>
            <div className="flex flex-wrap gap-2">
              <span className={`${chip} bg-[#E1F1FA] text-[#0A5C91]`}>{s.board}</span>
              <span className={`${chip} bg-[#E9EEF4] text-[#344251]`}>{s.type}</span>
              <span className={`${chip} bg-[#FDE8EF] text-[#C8104F]`}>{s.gender}</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#0B2A47] sm:text-4xl lg:text-[2.6rem]">
              {s.name}
            </h1>
            <p className="mt-3 text-[#5C6A7B]"><span className="text-[#EC0E58]">📍</span> {s.area}, {s.city}</p>

            <p className="mt-5 rounded-2xl border border-[#E1E7EE] border-l-4 border-l-[#EC0E58] bg-white px-5 py-4 text-[#4E5A68]">
              {intro}
            </p>

            <p className="mt-5 text-sm text-[#5C6A7B]">
              {s.reviews > 0 ? (
                <>
                  <span className="font-extrabold text-[#C8104F]">★ {s.rating}</span> ·{" "}
                  <a href="#reviews" className="underline underline-offset-2 hover:text-[#0A7BBF]">{s.reviews} parent reviews</a>
                </>
              ) : (
                <>No reviews yet · <a href="#reviews" className="font-semibold text-[#0A7BBF] hover:underline">Write the first review</a></>
              )}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a href={`tel:${phoneHref}`} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0A5C91] to-[#0795DC] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#0A5C91]/25 transition hover:-translate-y-0.5">
                📞 Call Now
              </a>
              <button type="button" onClick={() => openEnquiry()} className="rounded-xl bg-[#EC0E58] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#EC0E58]/25 transition hover:-translate-y-0.5 hover:bg-[#C8104F]">
                Enquire for 2027-28
              </button>
              <button type="button" onClick={() => router.push(`/compare?ids=${s.id}`)} className={ghost}>+ Add to compare</button>
              <button type="button" onClick={toggleSave} aria-pressed={saved} className={`${ghost} ${saved ? "!border-[#EC0E58] !text-[#EC0E58]" : ""}`}>
                {saved ? "♥ Saved" : "♡ Save"}
              </button>
              <button type="button" onClick={share} className={ghost}>↗ Share</button>
            </div>
          </div>
        </div>

        {/* Key facts */}
        <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-[#E1E7EE] bg-[#E1E7EE] shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((f) => (
            <div key={f.label} className="bg-white px-6 py-5">
              <dt className="text-[11px] font-extrabold uppercase tracking-wider text-[#5C6A7B]">{f.label}</dt>
              <dd className="mt-2 text-xl font-extrabold text-[#0B2A47]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-[#0B2A47] px-5 py-3 text-sm font-semibold text-white shadow-xl lg:bottom-8">
          {toast}
        </div>
      )}
    </section>
  );
}
