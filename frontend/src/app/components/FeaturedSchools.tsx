
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const schools = [
  {
    id: 1,
    name: "Maple Grove School",
    board: "CBSE",
    type: "Day Boarding",
    location: "Whitefield, Bengaluru",
    grades: "Nursery – Grade 12",
    fees: "₹1.2L – ₹1.8L",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=85",
    color: "bg-[#DDEAF2] text-[#0A5C91]",
  },
  {
    id: 2,
    name: "The Willow Academy",
    board: "ICSE",
    type: "Day",
    location: "Sarjapur Road, Bengaluru",
    grades: "KG – Grade 12",
    fees: "₹1.5L – ₹2.2L",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=85",
    color: "bg-[#FAE5EC] text-[#C8104F]",
  },
  {
    id: 3,
    name: "Oakridge Learning School",
    board: "IB",
    type: "Day Boarding",
    location: "Yelahanka, Bengaluru",
    grades: "Nursery – Grade 10",
    fees: "₹2.4L – ₹3.6L",
    image:
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=85",
    color: "bg-[#E5EAF0] text-[#39506B]",
  },
  {
    id: 4,
    name: "Green Valley School",
    board: "CBSE",
    type: "Full Boarding",
    location: "Gurugram, Delhi NCR",
    grades: "Nursery – Grade 10",
    fees: "₹80K – ₹1.5L",
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=85",
    color: "bg-[#FCE5ED] text-[#A34262]",
  },
  {
    id: 5,
    name: "Sunrise Public School",
    board: "State Board",
    type: "Day",
    location: "Sarjapur Road, Bengaluru",
    grades: "KG – Grade 12",
    fees: "₹70K – ₹1.2L",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85",
    color: "bg-[#DDEAF2] text-[#0A5C91]",
  },
  {
    id: 6,
    name: "Riverstone International School",
    board: "ICSE",
    type: "Full Boarding",
    location: "Yelahanka, Bengaluru",
    grades: "Nursery – Grade 10",
    fees: "₹1L – ₹2L",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=85",
    color: "bg-[#FAE5EC] text-[#C8104F]",
  },
];

export default function FeaturedSchools() {
  const router = useRouter();
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  function toggleCompare(id: number) {
    setCompareIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < 3
          ? [...current, id]
          : current
    );
  }

  function toggleSaved(id: number) {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAFCFD] via-[#F1F5F8] to-[#F0F4F7] py-16 sm:py-20">
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#F6D7E1]/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-10 h-80 w-80 rounded-full bg-[#D6DEE8]/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section heading */}
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#DDEAF2] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#0A5C91]">
              <span className="h-2 w-2 rounded-full bg-[#0A7BBF]" />
              Handpicked for you
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B2A47] sm:text-4xl">
              Featured Schools
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5C6A7B] sm:text-base">
              Discover schools highlighted by our partners. Paid placements
              will be clearly identified as featured.
            </p>
          </div>

          <div className="w-fit rounded-xl border border-[#F3D9E2] bg-[#FFF0F5] px-4 py-3 text-xs font-bold text-[#C8104F]">
            ✦ Featured partner schools
          </div>
        </div>

        {/* Compare status */}
        {compareIds.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#C9D3DF] bg-white p-4">
            <p className="text-sm font-semibold text-[#0A5C91]">
              {compareIds.length} school{compareIds.length > 1 ? "s" : ""} selected for comparison
              {compareIds.length === 3 ? " (maximum reached)" : ""}
            </p>
            <button
              type="button"
              onClick={() => {
                router.push(`/compare?ids=${compareIds.join(",")}`);
              }}
              className="rounded-xl bg-[#0A5C91] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0B3A5C]"
            >
              Compare Now →
            </button>
          </div>
        )}

        {/* School cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <article
              key={school.id}
              className="group overflow-hidden rounded-3xl border border-[#D9E0E8] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#12304A]/10"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden sm:h-56">
                <img
                  src={school.image}
                  alt={`${school.name} campus`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#172B32]/30 to-transparent" />

                <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-[#FCDDE7]/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#8F0B3B] shadow-sm">
                  ✦ Featured
                </span>

                <button
                  type="button"
                  aria-label={
                    savedIds.includes(school.id)
                      ? "Remove saved school"
                      : "Save school"
                  }
                  aria-pressed={savedIds.includes(school.id)}
                  onClick={() => toggleSaved(school.id)}
                  className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition hover:scale-105 ${
                    savedIds.includes(school.id)
                      ? "bg-[#FF9DBB] text-[#3B0B1E]"
                      : "bg-white/95 text-[#4E5A68]"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill={savedIds.includes(school.id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4z" />
                  </svg>
                </button>
              </div>

              {/* Card details */}
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold ${school.color}`}
                  >
                    {school.board}
                  </span>
                  <span className="rounded-lg bg-[#ECF1F5] px-2.5 py-1.5 text-[11px] font-semibold text-[#5C6A7B]">
                    Co-ed · {school.type}
                  </span>
                </div>

                <h3 className="mt-4 line-clamp-1 text-xl font-extrabold text-[#0B2A47] transition group-hover:text-[#0A7BBF]">
                  {school.name}
                </h3>

                <p className="mt-2 flex items-start gap-2 text-sm text-[#687789]">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#0A7BBF]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <span>{school.location}</span>
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-[#F3F6F8] p-3.5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#89938B]">
                      Grades
                    </p>
                    <p className="mt-2 text-xs font-bold leading-5 text-[#404A56]">
                      {school.grades}
                    </p>
                  </div>
                  <div className="border-l border-[#DBE0E5] pl-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#89938B]">
                      Annual fees*
                    </p>
                    <p className="mt-2 text-sm font-extrabold text-[#C8104F]">
                      {school.fees}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#E2E8EE] pt-4">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#5C6A7B]">
                    <input
                      type="checkbox"
                      checked={compareIds.includes(school.id)}
                      onChange={() => toggleCompare(school.id)}
                      className="h-4 w-4 accent-[#0A7BBF]"
                    />
                    Add to compare
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/schools/${school.id}`)
                    }
                    className="shrink-0 rounded-lg px-2 py-2 text-xs font-extrabold text-[#0A5C91] transition hover:bg-[#DDEAF2]"
                  >
                    View School ↗
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col items-center text-center">
          <p className="text-sm text-[#687789]">
            Looking for more schools and detailed filters?
          </p>

          <button
            type="button"
            onClick={() => router.push("/schools")}
            className="mt-4 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#0B2A47] to-[#41556B] px-7 py-4 text-sm font-extrabold text-white shadow-lg shadow-[#0B2A47]/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Explore More Schools
            <span className="text-lg">→</span>
          </button>

          <p className="mt-4 max-w-lg text-xs leading-5 text-[#8A938B]">
            *Fees shown are sample estimates for the design preview. Confirm
            actual fees, availability and school details with each school.
          </p>
        </div>
      </div>
    </section>
  );
}
