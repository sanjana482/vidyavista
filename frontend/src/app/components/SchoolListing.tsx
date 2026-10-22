"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BOARDS, GENDERS, TYPES, citiesOf, formatFee, stateFor, statesOf, type School } from "../data/schools";
import {
  clearPreference,
  isBoardingType,
  normalizeType,
  readPreference,
  savePreference,
  toHeroType,
  type Preference,
} from "../lib/preferences";
import { schoolPath } from "../lib/seo";

const PAGE_SIZE = 5;

type Filters = {
  q: string;
  state: string[];
  city: string[];
  type: string[];
  board: string[];
  gender: string[];
  min: string;
  max: string;
};

const EMPTY: Filters = { q: "", state: [], city: [], type: [], board: [], gender: [], min: "", max: "" };
const URL_FILTER_KEYS = ["q", "city", "state", "type", "board"];

// Saved cookie preference -> listing filters
function filtersFromPref(pref: Preference): Filters {
  const type = normalizeType(pref.type);
  const loc = pref.location ? [pref.location] : [];
  return {
    ...EMPTY,
    type: type ? [type] : [],
    state: isBoardingType(pref.type) ? loc : [],
    city: isBoardingType(pref.type) ? [] : loc,
  };
}
const FEE_PRESETS = [
  { label: "Below ₹50,000", max: "50000" },
  { label: "Below ₹1 lakh", max: "100000" },
  { label: "Below ₹2 lakh", max: "200000" },
];

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-t border-[#E1E7EE] py-5 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left text-xs font-extrabold uppercase tracking-wider text-[#0B2A47]"
      >
        {title}
        <span className={`text-[#0A7BBF] transition ${open ? "" : "-rotate-90"}`}>⌄</span>
      </button>
      {open && <div className="mt-3 space-y-1">{children}</div>}
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 text-sm text-[#4E5A68] transition hover:bg-[#F1F8FC]">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded accent-[#0795DC]" />
      {label}
    </label>
  );
}

export default function SchoolListing({ schools }: { schools: School[] }) {
  const CITIES = useMemo(() => citiesOf(schools), [schools]);
  const STATES = useMemo(() => statesOf(schools), [schools]);
  const router = useRouter();
  const params = useSearchParams();

  const fromUrl = useMemo<Filters>(
    () => ({
      ...EMPTY,
      q: params.get("q") ?? "",
      state: params.get("state") ? [params.get("state")!] : [],
      city: params.get("city") ? [params.get("city")!] : [],
      type: normalizeType(params.get("type") ?? "") ? [normalizeType(params.get("type")!)] : [],
      board: params.get("board") ? [params.get("board")!] : [],
    }),
    [params]
  );
  const hasUrlFilter = URL_FILTER_KEYS.some((k) => params.get(k));

  const [draft, setDraft] = useState<Filters>(fromUrl);
  const [applied, setApplied] = useState<Filters>(fromUrl);
  const [sort, setSort] = useState(params.get("sort") === "rating" ? "rating" : "recommended");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [compare, setCompare] = useState<number[]>([]);

  // Filters come from (1) the URL, or (2) when the URL has none, from the saved cookie
  // (what the user selected on Home last time). This is what pre-selects Mumbai + Day School.
  useEffect(() => {
    let next = fromUrl;
    if (!hasUrlFilter) {
      const pref = readPreference();
      if (pref) next = filtersFromPref(pref);
    }
    setDraft(next);
    setApplied(next);
    setPage(1);
  }, [fromUrl, hasUrlFilter]);

  // Remember the choice made in the filters so the next visit starts from the same place.
  function syncCookie(f: Filters) {
    if (f.type.length !== 1) return;
    const heroType = toHeroType(f.type[0]);
    const location = isBoardingType(heroType) ? f.state[0] ?? "" : f.city[0] ?? "";
    savePreference({ type: heroType, location });
  }

  const toggle = (key: "state" | "city" | "type" | "board" | "gender", value: string) =>
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(value) ? d[key].filter((v) => v !== value) : [...d[key], value],
    }));

  const results = useMemo(() => {
    const q = applied.q.toLowerCase();
    const min = applied.min ? Number(applied.min) : 0;
    const max = applied.max ? Number(applied.max) : Infinity;
    const list = schools.filter(
      (s) =>
        (!q || `${s.name} ${s.area} ${s.city} ${s.board}`.toLowerCase().includes(q)) &&
        (!applied.state.length || applied.state.includes(stateFor(s))) &&
        (!applied.city.length || applied.city.includes(s.city)) &&
        (!applied.type.length || applied.type.includes(s.type)) &&
        (!applied.board.length || applied.board.includes(s.board)) &&
        (!applied.gender.length || applied.gender.includes(s.gender)) &&
        s.fee >= min &&
        s.fee <= max
    );
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    if (sort === "fee-low") list.sort((a, b) => a.fee - b.fee);
    if (sort === "fee-high") list.sort((a, b) => b.fee - a.fee);
    return list;
  }, [applied, sort]);

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function apply() {
    setApplied(draft);
    syncCookie(draft);
    setPage(1);
    setShowFilters(false);
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
  }
  function clearAll() {
    clearPreference();
    setDraft(EMPTY);
    setApplied(EMPTY);
    setPage(1);
    if (params.toString()) router.push("/schools", { scroll: false });
  }
  function goTo(p: number) {
    setPage(p);
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
  }
  function toggleCompare(id: number) {
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < 3 ? [...c, id] : c));
  }

  const numInput =
    "h-11 w-full rounded-xl border border-[#D6DDE5] bg-white px-3 text-sm text-[#0B2A47] outline-none placeholder:text-[#8896A6] focus:border-[#0795DC] focus:ring-4 focus:ring-[#0795DC]/15";

  return (
    <section id="results" className="scroll-mt-24 bg-white py-10 sm:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[290px_1fr] lg:px-8">
        {/* ---------- Filters ---------- */}
        <aside>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="mb-4 flex w-full items-center justify-between rounded-xl border border-[#D6DDE5] bg-white px-4 py-3 text-sm font-extrabold text-[#0A5C91] lg:hidden"
          >
            ⚙ Filters <span>{showFilters ? "✕" : "☰"}</span>
          </button>

          <div className={`${showFilters ? "block" : "hidden"} lg:sticky lg:top-24 lg:block`}>
            <div className="flex max-h-[calc(100vh-7.5rem)] flex-col rounded-2xl border border-[#E1E7EE] bg-white shadow-lg shadow-[#0B2A47]/5">
              <div className="flex items-center justify-between border-b border-[#E1E7EE] px-5 py-4">
                <h2 className="text-lg font-extrabold text-[#0B2A47]">⚙ Filters</h2>
                <button type="button" onClick={clearAll} className="text-sm font-semibold text-[#EC0E58] underline underline-offset-4 hover:text-[#C8104F]">
                  Clear all
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <FilterGroup title="State">
                  {STATES.map((c) => <Check key={c} label={c} checked={draft.state.includes(c)} onChange={() => toggle("state", c)} />)}
                </FilterGroup>
                <FilterGroup title="City">
                  {CITIES.map((c) => <Check key={c} label={c} checked={draft.city.includes(c)} onChange={() => toggle("city", c)} />)}
                </FilterGroup>
                <FilterGroup title="School type">
                  {TYPES.map((c) => <Check key={c} label={c} checked={draft.type.includes(c)} onChange={() => toggle("type", c)} />)}
                </FilterGroup>
                <FilterGroup title="Annual fees">
                  <div className="grid grid-cols-2 gap-2 pb-2">
                    <input inputMode="numeric" placeholder="Min ₹" value={draft.min} onChange={(e) => setDraft({ ...draft, min: e.target.value.replace(/\D/g, "") })} className={numInput} />
                    <input inputMode="numeric" placeholder="Max ₹" value={draft.max} onChange={(e) => setDraft({ ...draft, max: e.target.value.replace(/\D/g, "") })} className={numInput} />
                  </div>
                  {FEE_PRESETS.map((p) => (
                    <Check
                      key={p.label}
                      label={p.label}
                      checked={draft.max === p.max && !draft.min}
                      onChange={() => setDraft({ ...draft, min: "", max: draft.max === p.max ? "" : p.max })}
                    />
                  ))}
                </FilterGroup>
                <FilterGroup title="School board">
                  {BOARDS.map((c) => <Check key={c} label={c} checked={draft.board.includes(c)} onChange={() => toggle("board", c)} />)}
                </FilterGroup>
                <FilterGroup title="Gender">
                  {GENDERS.map((c) => <Check key={c} label={c} checked={draft.gender.includes(c)} onChange={() => toggle("gender", c)} />)}
                </FilterGroup>
              </div>

              <div className="border-t border-[#E1E7EE] p-4">
                <button
                  type="button"
                  onClick={apply}
                  className="w-full rounded-xl bg-gradient-to-r from-[#0A5C91] to-[#0795DC] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#0A5C91]/25 transition hover:-translate-y-0.5"
                >
                  Apply filters
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ---------- Results ---------- */}
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0B2A47]">Schools for You</h2>
              <p className="mt-1 text-sm text-[#707E8F]">
                Showing {results.length} of {schools.length} schools
              </p>
            </div>
            <label className="flex items-center gap-3 text-sm text-[#5C6A7B]">
              Sort by
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="h-11 rounded-xl border border-[#D6DDE5] bg-white px-4 font-semibold text-[#0B2A47] outline-none focus:border-[#0795DC] focus:ring-4 focus:ring-[#0795DC]/15"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest rated</option>
                <option value="fee-low">Fees: low to high</option>
                <option value="fee-high">Fees: high to low</option>
              </select>
            </label>
          </div>

          <div className="mt-6 space-y-5">
            {visible.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#C9D3DE] bg-[#F6FAFD] p-10 text-center">
                <p className="text-lg font-extrabold text-[#0B2A47]">No schools match these filters</p>
                <p className="mt-2 text-sm text-[#707E8F]">Try removing a filter or widening your fee range.</p>
                <button onClick={clearAll} className="mt-5 rounded-xl bg-[#0A5C91] px-6 py-3 text-sm font-bold text-white hover:bg-[#0795DC]">
                  Clear all filters
                </button>
              </div>
            )}

            {visible.map((s) => (
              <article key={s.id} className="rounded-3xl border border-[#E1E7EE] bg-white p-5 shadow-sm transition hover:border-[#9ED8F5] hover:shadow-xl hover:shadow-[#0795DC]/10">
                <div className="grid gap-5 md:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr_230px]">
                  {/* Photo */}
                  <div className="relative h-52 overflow-hidden rounded-2xl bg-[#E6F4FC] md:h-auto md:min-h-[210px]">
                    <img src={s.image} alt={`${s.name} campus`} loading="lazy" className="h-full w-full object-cover" />
                    {s.topRated && (
                      <span className="absolute left-3 top-3 rounded-lg bg-[#0795DC] px-3 py-1.5 text-xs font-extrabold text-white shadow">
                        ★ Top rated
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 rounded-lg bg-[#0B2A47]/85 px-2.5 py-1.5 text-xs font-bold text-white">
                      ▣ {s.photos} photos
                    </span>
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <h3 className="text-2xl font-extrabold leading-tight text-[#0B2A47]">
                      <Link href={schoolPath(s)} className="transition hover:text-[#0A7BBF]">{s.name}</Link>
                    </h3>
                    <p className="mt-2 text-sm text-[#707E8F]">
                      <span className="text-[#EC0E58]">📍</span> {s.area}, {s.city === "Delhi" ? "New Delhi" : s.city}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-lg bg-[#E1F1FA] px-3 py-1.5 text-xs font-extrabold text-[#0A5C91]">{s.board}</span>
                      <span className="text-[#5C6A7B]">{s.grades}</span>
                    </div>
                    <p className="mt-3 text-sm text-[#5C6A7B]">{s.type} · {s.gender}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.facilities.map((f) => (
                        <span key={f} className="rounded-full border border-[#D6DDE5] bg-[#F6FAFD] px-3 py-1.5 text-xs text-[#4E5A68]">
                          <span className="text-[#0795DC]">✓</span> {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price + actions */}
                  <div className="flex flex-col border-t border-[#E1E7EE] pt-5 md:col-span-2 xl:col-span-1 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0 xl:text-right">
                    <div className="flex items-center justify-between xl:flex-col xl:items-end xl:gap-1">
                      {s.reviews > 0 ? (
                        <>
                          <span className="rounded-lg bg-[#FDE8EF] px-3 py-1.5 text-sm font-extrabold text-[#C8104F]">★ {s.rating} / 5</span>
                          <Link href={`${schoolPath(s)}#reviews`} className="text-xs text-[#5C6A7B] underline underline-offset-2 hover:text-[#0A7BBF]">{s.reviews} parent reviews</Link>
                        </>
                      ) : (
                        <Link href={`${schoolPath(s)}#reviews`} className="text-xs text-[#5C6A7B] underline underline-offset-2 hover:text-[#0A7BBF]">No reviews yet</Link>
                      )}
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-[#707E8F]">Annual tuition from</p>
                      <p className="text-3xl font-extrabold text-[#0B2A47]">{formatFee(s.fee)}</p>
                      <p className="text-xs text-[#8896A6]">per year · indicative</p>
                    </div>
                    <a
                      href={`tel:${s.phone}`}
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#0795DC] px-4 py-3 text-sm font-extrabold text-[#0A7BBF] transition hover:bg-[#0795DC] hover:text-white"
                    >
                      📞 Call Now
                    </a>
                  </div>
                </div>

                {/* Footer row */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#E1E7EE] pt-4">
                  <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#4E5A68]">
                    <input type="checkbox" checked={compare.includes(s.id)} onChange={() => toggleCompare(s.id)} className="h-4 w-4 accent-[#EC0E58]" />
                    Add to compare
                  </label>
                  <span className="hidden text-xs text-[#707E8F] sm:block">🏫 Campus visits available</span>
                  <div className="flex gap-3">
                    <Link href={schoolPath(s)} className="rounded-xl border border-[#D6DDE5] px-5 py-3 text-sm font-bold text-[#0B2A47] transition hover:border-[#0795DC] hover:text-[#0A7BBF]">
                      View School
                    </Link>
                    <Link
                      href={`/counselling?school=${encodeURIComponent(s.name)}`}
                      className="rounded-xl bg-[#EC0E58] px-5 py-3 text-sm font-extrabold text-white shadow-md shadow-[#EC0E58]/25 transition hover:-translate-y-0.5 hover:bg-[#C8104F]"
                    >
                      Enquire ↗
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2">
              <button disabled={current === 1} onClick={() => goTo(current - 1)} className="h-11 w-11 rounded-xl border border-[#D6DDE5] font-bold text-[#0B2A47] disabled:opacity-40">‹</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goTo(p)}
                  aria-current={p === current}
                  className={`h-11 w-11 rounded-xl border font-extrabold transition ${
                    p === current ? "border-transparent bg-gradient-to-br from-[#0A5C91] to-[#0795DC] text-white shadow-md" : "border-[#D6DDE5] text-[#0B2A47] hover:border-[#0795DC]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button disabled={current === pages} onClick={() => goTo(current + 1)} className="h-11 w-11 rounded-xl border border-[#D6DDE5] font-bold text-[#0B2A47] disabled:opacity-40">›</button>
            </nav>
          )}
        </div>
      </div>

      {/* Floating compare bar */}
      {compare.length > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-[calc(100%-2rem)] max-w-xl items-center justify-between gap-4 rounded-2xl bg-[#0B2A47] px-5 py-4 text-white shadow-2xl">
          <p className="text-sm font-semibold">{compare.length} of 3 schools selected</p>
          <div className="flex gap-2">
            <button onClick={() => setCompare([])} className="rounded-lg px-3 py-2 text-sm text-white/80 hover:text-white">Clear</button>
            <button onClick={() => router.push(`/compare?ids=${compare.join(",")}`)} className="rounded-xl bg-[#EC0E58] px-5 py-2.5 text-sm font-extrabold hover:bg-[#C8104F]">
              Compare →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
