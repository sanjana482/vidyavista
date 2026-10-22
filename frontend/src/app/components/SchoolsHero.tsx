"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ListingDescription from "./ListingDescription";
import { BOARDS, TYPES, citiesOf, statesOf, type School } from "../data/schools";
import { isBoardingType, normalizeType, readPreference, savePreference, toHeroType } from "../lib/preferences";

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export default function SchoolsHero({ schools }: { schools: School[] }) {
  const CITIES = citiesOf(schools);
  const STATES = statesOf(schools);
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [board, setBoard] = useState("");
  // "city:Mumbai" or "state:Maharashtra" (empty = all locations)
  const [loc, setLoc] = useState("");

  // Pre-select the search bar from the URL, or from the saved cookie when the URL has no filters.
  const urlKey = params.toString();
  useEffect(() => {
    const urlType = normalizeType(params.get("type") ?? "");
    const urlCity = params.get("city");
    const urlState = params.get("state");
    const hasUrl = ["q", "type", "board", "city", "state"].some((k) => params.get(k));
    if (hasUrl) {
      setQ(params.get("q") ?? "");
      setType(urlType);
      setBoard(params.get("board") ?? "");
      setLoc(urlCity ? `city:${urlCity}` : urlState ? `state:${urlState}` : "");
      return;
    }
    const pref = readPreference();
    if (pref) {
      setType(normalizeType(pref.type));
      setLoc(pref.location ? `${isBoardingType(pref.type) ? "state" : "city"}:${pref.location}` : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);

  const cityCount = new Set(schools.map((s) => s.city)).size;
  const boardCount = new Set(schools.map((s) => s.board)).size;

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (type) params.set("type", type);
    if (board) params.set("board", board);
    const [kind, value] = loc.split(":");
    if (value) params.set(kind === "state" ? "state" : "city", value);
    if (type) savePreference({ type: toHeroType(type), location: value ?? "" });
    router.push(`/schools${params.toString() ? `?${params}` : ""}`, { scroll: false });
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 80);
  }

  const field =
    "h-12 w-full rounded-xl border border-[#D6DDE5] bg-white px-4 text-sm text-[#0B2A47] outline-none transition placeholder:text-[#8896A6] focus:border-[#0795DC] focus:ring-4 focus:ring-[#0795DC]/15";
  const label = "mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-[#5C6A7B]";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E6F4FC] via-white to-[#FDE8EF]">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#0795DC]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#EC0E58]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-[#5C6A7B]">
          <Link href="/" className="hover:text-[#0A7BBF]">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-[#0B2A47]">Schools</span>
        </nav>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <span className="inline-flex rounded-full border border-[#D6DDE5] bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0A5C91] shadow-sm">
              Find the right fit for your child
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#0B2A47] sm:text-5xl">
              Best Schools in India{" "}
              <span className="bg-gradient-to-r from-[#0795DC] to-[#EC0E58] bg-clip-text text-transparent">
                2027-28
              </span>
            </h1>

            <div className="mt-5">
              <ListingDescription
                description="Choosing a school is easier when you can compare boards, annual fees, facilities and parent feedback in one place. VidyaVista lists CBSE, ICSE, IB, Cambridge and State Board schools across major Indian cities, with day, boarding and day-cum-boarding options."
                maxLength={180}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#4E5A68]">
              {[
                [schools.length, "schools listed"],
                [cityCount, "cities"],
                [boardCount, "boards"],
              ].map(([n, t]) => (
                <span key={t as string} className="rounded-full border border-[#D6DDE5] bg-white px-4 py-2 shadow-sm">
                  <strong className="font-extrabold text-[#0A5C91]">{n}</strong> {t}
                </span>
              ))}
              <span className="rounded-full border border-[#D6DDE5] bg-white px-4 py-2 font-semibold shadow-sm">
                Fees · Reviews · Admission
              </span>
            </div>
          </div>

          <div className="hidden grid-cols-2 gap-3 lg:grid">
            <div className="row-span-2 overflow-hidden rounded-3xl border-4 border-white shadow-xl shadow-[#0A5C91]/15">
              <img src={photo("photo-1580582932707-520aed937b7b")} alt="School campus" className="h-full w-full object-cover" />
            </div>
            <div className="overflow-hidden rounded-3xl border-4 border-white shadow-xl shadow-[#0A5C91]/15">
              <img src={photo("photo-1509062522246-3755977927d7")} alt="Students in class" className="h-36 w-full object-cover" />
            </div>
            <div className="overflow-hidden rounded-3xl border-4 border-white shadow-xl shadow-[#EC0E58]/15">
              <img src={photo("photo-1523050854058-8df90110c9f1")} alt="Teacher and student" className="h-36 w-full object-cover" />
            </div>
          </div>
        </div>

        {/* Search bar */}
        <form
          onSubmit={onSearch}
          className="mt-10 grid gap-4 rounded-3xl border border-[#E1E7EE] bg-white p-5 shadow-xl shadow-[#0B2A47]/5 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto] lg:items-end"
        >
          <div>
            <label htmlFor="hq" className={label}>Search schools</label>
            <input id="hq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="School name, location or keyword" className={field} />
          </div>
          <div>
            <label htmlFor="ht" className={label}>School type</label>
            <select id="ht" value={type} onChange={(e) => setType(e.target.value)} className={field}>
              <option value="">All types</option>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="hb" className={label}>Board</label>
            <select id="hb" value={board} onChange={(e) => setBoard(e.target.value)} className={field}>
              <option value="">All boards</option>
              {BOARDS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="hl" className={label}>Location</label>
            <select id="hl" value={loc} onChange={(e) => setLoc(e.target.value)} className={field}>
              <option value="">All locations</option>
              <optgroup label="Cities">
                {CITIES.map((c) => <option key={c} value={`city:${c}`}>{c}</option>)}
              </optgroup>
              <optgroup label="States">
                {STATES.map((c) => <option key={c} value={`state:${c}`}>{c}</option>)}
              </optgroup>
            </select>
          </div>
          <button
            type="submit"
            className="h-12 rounded-xl bg-gradient-to-r from-[#0A5C91] to-[#0795DC] px-7 text-sm font-extrabold text-white shadow-lg shadow-[#0A5C91]/25 transition hover:-translate-y-0.5 md:col-span-2 lg:col-span-1"
          >
            ⌕ Search
          </button>
        </form>
      </div>
    </section>
  );
}
