
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const schools = [
  {
    id: 101,
    name: "Oakwood Public School",
    board: "CBSE",
    type: "Day",
    location: "Mumbai, Maharashtra",
    searches: "1,240",
    badge: "↗ Most searched",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 102,
    name: "Greenfield Academy",
    board: "ICSE",
    type: "Day",
    location: "Pune, Maharashtra",
    searches: "980",
    badge: "↗ Popular",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 103,
    name: "Riverstone International School",
    board: "CBSE",
    type: "Day Boarding",
    location: "Bengaluru, Karnataka",
    searches: "865",
    badge: "↗ Popular",
    image:
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1000&q=85",
  },
];

export default function RecommendedSchools() {
  const router = useRouter();
  const [selectedSchools, setSelectedSchools] = useState<number[]>([]);

  function toggleCompare(id: number) {
    setSelectedSchools((current) =>
      current.includes(id)
        ? current.filter((schoolId) => schoolId !== id)
        : current.length < 3
          ? [...current, id]
          : current
    );
  }

  function openCompare() {
    if (selectedSchools.length > 0) {
      router.push(`/compare?ids=${selectedSchools.join(",")}`);
    }
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section heading */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-[#DDEAF2] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#0E547C]">
              Discover schools
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B2A47] sm:text-4xl">
              Recommended Schools
            </h2>

            <p className="mt-3 text-sm text-[#626F7D] sm:text-base">
              Schools parents are searching for most often.
            </p>
          </div>

          <span className="pb-1 text-sm font-semibold text-[#C8104F]">
            Popular searches
          </span>
        </div>

        {/* School cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {schools.map((school) => {
            const selected = selectedSchools.includes(school.id);

            return (
              <article
                key={school.id}
                className="group overflow-hidden rounded-3xl border border-[#DFE3E8] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#FF6B9A] hover:shadow-xl hover:shadow-[#C8104F]/10"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden sm:h-60">
                  <img
                    src={school.image}
                    alt={`${school.name} campus`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A47]/30 via-transparent to-transparent" />

                  <span className="absolute left-4 top-4 rounded-full bg-[#0B2A47] px-3.5 py-2 text-xs font-bold text-white shadow-lg">
                    {school.badge}
                  </span>
                </div>

                {/* School details */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-lg bg-[#E5EBF1] px-3 py-1.5 text-xs font-bold text-[#4F5964]">
                      {school.board}
                    </span>

                    <span className="rounded-lg bg-[#E5EEF3] px-3 py-1.5 text-xs font-bold text-[#0E567F]">
                      {school.type}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-extrabold leading-snug text-[#0B2A47] transition group-hover:text-[#C8104F]">
                    {school.name}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm text-[#707E8F]">
                    <span className="text-[#D97798]">📍</span>
                    {school.location}
                  </p>

                  <div className="my-5 border-t border-[#DFE3E8]" />

                  <p className="flex items-center gap-2 text-sm text-[#626F7D]">
                    <span className="text-[#C8104F]">⌕</span>
                    <span>
                      <strong className="font-extrabold text-[#0B2A47]">
                        {school.searches}
                      </strong>{" "}
                      searches this month
                    </span>
                  </p>

                  {/* Compare and view actions */}
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#707E8F]">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleCompare(school.id)}
                        className="h-4 w-4 accent-[#C8104F]"
                      />
                      Add to compare
                    </label>

                    <button
                      type="button"
                      onClick={() => router.push(`/schools/${school.id}`)}
                      className="rounded-lg px-2 py-2 text-sm font-extrabold text-[#344251] transition hover:bg-[#F8EAEF] hover:text-[#C8104F]"
                    >
                      View school →
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Demo data note */}
        <p className="mt-5 text-xs leading-5 text-[#8A8290]">
          Search counts are sample UI data. Replace them with real aggregated
          school-search activity before publishing.
        </p>

        {/* Bottom action */}
        <div className="mt-12 flex flex-col items-center text-center">
          <p className="text-sm text-[#707E8F]">
            Find a school that fits your needs.
          </p>

          {selectedSchools.length > 0 && (
            <button
              type="button"
              onClick={openCompare}
              className="mt-4 rounded-xl bg-[#0E567F] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0B4262]"
            >
              Compare selected ({selectedSchools.length})
            </button>
          )}

          <button
            type="button"
            onClick={() => router.push("/schools")}
            className="mt-4 rounded-xl bg-[#0B2A47] px-7 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#41556B]"
          >
            Explore All Schools →
          </button>
        </div>
      </div>
    </section>
  );
}
