
"use client";

import { useRouter } from "next/navigation";
import { normalizeType, readPreference, savePreference, toHeroType } from "../lib/preferences";


const categories = [
  {
    title: "Day Schools",
    description: "Explore schools for everyday learning and growth.",
    icon: "☀️",
    color: "bg-[#DDEAF2]",
    iconBg: "bg-[#A6D8F5]",
    textColor: "text-[#0A5C91]",
    type: "Day Schools",
  },
  {
    title: "Boarding Schools",
    description: "Discover schools with residential facilities.",
    icon: "🏫",
    color: "bg-[#FAE5EC]",
    iconBg: "bg-[#F0C7D5]",
    textColor: "text-[#C8104F]",
    type: "Boarding Schools",
  },
  {
    title: "Day + Boarding",
    description: "Find schools offering both learning options.",
    icon: "🌿",
    color: "bg-[#E5EAF0]",
    iconBg: "bg-[#FFC2D4]",
    textColor: "text-[#39506B]",
    type: "Day + Boarding",
  },
];


export default function Categories() {
  const router = useRouter();

  function exploreCategory(type: string) {
    // keep the saved location only if the user stays on the same type
    const heroType = toHeroType(normalizeType(type));
    const saved = readPreference();
    savePreference({
      type: heroType,
      location: saved && saved.type === heroType ? saved.location : "",
    });
    router.push(`/schools?type=${encodeURIComponent(type)}`);
  }

  return (
    <section className="relative overflow-hidden bg-[#FAFCFD] py-16 sm:py-20">
      <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-[#FFC2D4]/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#A6D8F5]/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex rounded-full bg-[#DDEAF2] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#0A5C91]">
              Find Your Fit
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#12304A] sm:text-4xl">
              Explore Schools
              <span className="block text-[#0A7BBF]">
                Your Way
              </span>
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-[#5C6A7B]">
              Every child learns differently. Explore school categories and
              discover the learning environment that suits your family.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/schools")}
            className="w-fit rounded-xl border border-[#C9D3DF] bg-white px-5 py-3 font-bold text-[#0A5C91] transition hover:border-[#0A7BBF] hover:bg-[#EAF1F5]"
          >
            View All Schools →
          </button>
        </div>


<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <button
              key={category.title}
              type="button"
              onClick={() => exploreCategory(category.type)}
              className={`group relative overflow-hidden rounded-3xl border border-white ${category.color} p-6 text-left shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl`}
            >
              <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/40 transition-transform duration-300 group-hover:scale-125" />

              <div
                className={`relative flex h-16 w-16 items-center justify-center rounded-2xl ${category.iconBg} text-3xl shadow-sm transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110`}
              >
                {category.icon}
              </div>

              <h3 className={`relative mt-6 text-xl font-extrabold ${category.textColor}`}>
                {category.title}
              </h3>

              <p className="relative mt-3 min-h-[72px] text-sm leading-6 text-[#525F6D]">
                {category.description}
              </p>

              <div className={`relative mt-5 flex items-center gap-2 text-sm font-extrabold ${category.textColor}`}>
                Explore category
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>

              <span className="absolute bottom-0 left-0 h-1 w-0 bg-current transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
