
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ratedSchools = [
  {
    id: 1,
    name: "Oakridge International School",
    rating: 4.9,
    reviews: 248,
    board: "CBSE",
    type: "Day",
    location: "Bengaluru",
    grades: "Nursery – Grade 12",
    fees: "₹1.2L – ₹2.4L",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 2,
    name: "Bright Future Academy",
    rating: 4.8,
    reviews: 186,
    board: "ICSE",
    type: "Day Boarding",
    location: "Pune",
    grades: "KG – Grade 12",
    fees: "₹85K – ₹1.6L",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 3,
    name: "Greenfield Public School",
    rating: 4.7,
    reviews: 152,
    board: "CBSE",
    type: "Day",
    location: "Mumbai",
    grades: "Nursery – Grade 10",
    fees: "₹55K – ₹1.1L",
    image:
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 4,
    name: "Riverdale Academy",
    rating: 4.6,
    reviews: 129,
    board: "ICSE",
    type: "Day",
    location: "Hyderabad",
    grades: "Nursery – Grade 12",
    fees: "₹70K – ₹1.3L",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 5,
    name: "Green Valley School",
    rating: 4.8,
    reviews: 203,
    board: "CBSE",
    type: "Boarding",
    location: "Dehradun",
    grades: "Grade 1 – Grade 12",
    fees: "₹1.5L – ₹2.5L",
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 6,
    name: "Sunrise Public School",
    rating: 4.7,
    reviews: 174,
    board: "State Board",
    type: "Day",
    location: "Jaipur",
    grades: "Nursery – Grade 12",
    fees: "₹60K – ₹1.2L",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=85",
  },
];

export default function HighestRatedSchools() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  function scrollSchools(direction: "left" | "right") {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -350 : 350,
      behavior: "smooth",
    });
  }

  function toggleSaved(id: number) {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id]
    );
  }

  return (
    <section className="overflow-hidden bg-gradient-to-b from-[#FCF6F8] via-[#F8F0F3] to-[#F3F8FB] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Heading and navigation arrows */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-[#FCDDE7] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#C8104F]">
              Parent favourites
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B2A47] sm:text-4xl">
              Highest Rated Schools
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#626F7D] sm:text-base">
              Explore school ratings, reviews, school types and fee details.
            </p>
          </div>

          <div className="flex shrink-0 gap-2 pb-1">
            <button
              type="button"
              onClick={() => scrollSchools("left")}
              aria-label="Previous schools"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EAD3DB] bg-white text-2xl text-[#C8104F] shadow-sm transition hover:border-[#C8104F] hover:bg-[#FAE5EC]"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => scrollSchools("right")}
              aria-label="Next schools"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EAD3DB] bg-white text-2xl text-[#C8104F] shadow-sm transition hover:border-[#C8104F] hover:bg-[#FAE5EC]"
            >
              ›
            </button>
          </div>
        </div>

        {/* Horizontally scrollable school cards */}
        <div
          ref={scrollRef}
          className="mt-9 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {ratedSchools.map((school) => (
            <article
              key={school.id}
              className="group w-[285px] min-w-[285px] snap-start overflow-hidden rounded-3xl border border-[#DDE2E8] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#C8104F]/10 sm:w-[320px] sm:min-w-[320px]"
            >
              {/* School photo */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={school.image}
                  alt={`${school.name} campus`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A47]/20 to-transparent" />

                <span className="absolute left-3 top-3 rounded-lg border border-white/70 bg-[#FCDDE7]/95 px-3 py-1.5 text-xs font-extrabold text-[#C8104F]">
                  ★ {school.rating.toFixed(1)} Rating
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
                  className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition hover:scale-105 ${
                    savedIds.includes(school.id)
                      ? "bg-[#FF9DBB] text-[#3B0B1E]"
                      : "bg-white text-[#C8104F]"
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

              {/* School information */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-[#E5EBF1] px-2.5 py-1.5 text-[11px] font-bold text-[#4F5964]">
                    {school.board}
                  </span>

                  <span className="rounded-md bg-[#E7EEF2] px-2.5 py-1.5 text-[11px] font-bold text-[#0E547C]">
                    Co-ed
                  </span>
                </div>

                <h3 className="mt-4 line-clamp-1 text-lg font-extrabold text-[#0B2A47] transition group-hover:text-[#C8104F]">
                  {school.name}
                </h3>

                <p className="mt-2 flex items-center gap-2 text-sm text-[#707E8F]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-[#D97798]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  {school.location}
                </p>

                {/* Rating and review count */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <span
                    aria-label={`${school.rating} out of 5 stars`}
                    className="tracking-wide text-[#E99A24]"
                  >
                    ★★★★★
                  </span>

                  <span className="font-extrabold text-[#0B2A47]">
                    {school.rating.toFixed(1)}/5
                  </span>

                  <span className="text-xs text-[#707E8F]">
                    ({school.reviews} reviews)
                  </span>
                </div>

                {/* Grades and fees */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-b border-[#DFE3E8] pb-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#98909A]">
                      School type
                    </p>
                    <p className="mt-2 text-xs font-bold text-[#444E59]">
                      {school.type}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#98909A]">
                      Annual fee*
                    </p>
                    <p className="mt-2 text-xs font-extrabold text-[#C8104F]">
                      {school.fees}
                    </p>
                  </div>

                  <div className="col-span-2 mt-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#98909A]">
                      Grades
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#444E59]">
                      {school.grades}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-[#707E8F]">
                    School profile
                  </span>

                  <button
                    type="button"
                    onClick={() => router.push(`/schools/${school.id}`)}
                    className="rounded-lg px-3 py-2 text-xs font-extrabold text-[#C8104F] transition hover:bg-[#FAE5EC]"
                  >
                    View School →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer and CTA */}
        <div className="mt-6 flex flex-col items-center text-center">
          <p className="text-sm text-[#707E8F]">
            Compare ratings, fees and school details.
          </p>

          <button
            type="button"
            onClick={() => router.push("/schools?sort=rating")}
            className="mt-4 rounded-xl bg-gradient-to-r from-[#0B2A47] to-[#475E78] px-7 py-4 text-sm font-extrabold text-white shadow-lg shadow-[#C8104F]/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Explore All Schools →
          </button>

          <p className="mt-4 max-w-2xl text-xs leading-5 text-[#8A8290]">
            *School names, ratings, review counts and fees are illustrative
            demo data. Replace them with verified school information before
            publishing.
          </p>
        </div>
      </div>
    </section>
  );
}
