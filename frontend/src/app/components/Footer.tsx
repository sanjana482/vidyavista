
"use client";

import { useState } from "react";
import Link from "next/link";

type BrowseTab = "region" | "board" | "popular";

const regions = [
  {
    name: "North India",
    types: ["Day Schools", "Boarding Schools", "Day + Boarding Schools"],
    cities: ["Delhi NCR", "Gurugram", "Noida", "Dehradun", "Chandigarh", "Jaipur", "Lucknow", "Shimla"],
  },
  {
    name: "South India",
    types: ["Day Schools", "Boarding Schools", "Day + Boarding Schools"],
    cities: ["Bengaluru", "Chennai", "Hyderabad", "Kochi", "Coimbatore", "Mysuru", "Visakhapatnam"],
  },
  {
    name: "West India",
    types: ["Day Schools", "Boarding Schools", "Day + Boarding Schools"],
    cities: ["Mumbai", "Pune", "Thane", "Nashik", "Nagpur", "Ahmedabad", "Surat", "Vadodara"],
  },
  {
    name: "East India",
    types: ["Day Schools", "Boarding Schools", "Day + Boarding Schools"],
    cities: ["Kolkata", "Bhubaneswar", "Patna", "Ranchi", "Guwahati", "Siliguri", "Jamshedpur"],
  },
];

const boards = [
  { name: "CBSE Schools", cities: ["Delhi NCR", "Mumbai", "Bengaluru", "Pune", "Jaipur"] },
  { name: "ICSE Schools", cities: ["Mumbai", "Kolkata", "Bengaluru", "Chennai", "Pune"] },
  { name: "IB Schools", cities: ["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad"] },
  { name: "State Board Schools", cities: ["Maharashtra", "Gujarat", "Tamil Nadu", "Karnataka"] },
];

const popular = [
  { name: "Best Schools in India", cities: ["Top Rated Schools", "Affordable Schools", "Best CBSE Schools"] },
  { name: "Schools by Budget", cities: ["Below ₹50,000", "₹50,000–₹1 Lakh", "₹1–₹3 Lakh", "Above ₹3 Lakh"] },
  { name: "Schools by Type", cities: ["Day Schools", "Boarding Schools", "Day + Boarding Schools"] },
  { name: "Admission Searches", cities: ["Nursery Admissions", "Class 1 Admissions", "International Schools"] },
];

// ---- links into the /schools listing (filters are read from the URL) ----
const KNOWN_CITIES = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad", "Chennai"];
const BOARD_PARAM: Record<string, string> = {
  "CBSE Schools": "CBSE",
  "ICSE Schools": "ICSE",
  "IB Schools": "IB",
  "State Board Schools": "State Board",
};
const TYPE_OPTIONS = [
  { label: "Day Schools", value: "Day", icon: "🏠", hint: "Home every evening" },
  { label: "Boarding Schools", value: "Full Boarding", icon: "🏫", hint: "Fully residential" },
  { label: "Day + Boarding Schools", value: "Day Boarding", icon: "🔄", hint: "Both options on one campus" },
];
const TYPE_BY_LABEL: Record<string, string> = Object.fromEntries(TYPE_OPTIONS.map((t) => [t.label, t.value]));

function schoolsHref(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v && qs.set(k, v));
  const q = qs.toString();
  return q ? `/schools?${q}` : "/schools";
}
// a known city becomes the City filter, anything else becomes a text search
function placeParams(place: string): Record<string, string> {
  const city = place === "Delhi NCR" ? "Delhi" : place;
  return KNOWN_CITIES.includes(city) ? { city } : { q: place };
}

function BoardCard({
  item, open, city, onToggle, onCity,
}: {
  item: { name: string; cities: string[] };
  open: boolean;
  city: string | null;
  onToggle: () => void;
  onCity: (c: string) => void;
}) {
  const board = BOARD_PARAM[item.name] ?? item.name;
  const panelId = `board-panel-${board.replace(/\W+/g, "-").toLowerCase()}`;
  const place = city ? placeParams(city) : {};

  return (
    <div className={`rounded-2xl border p-5 transition ${open ? "border-[#FF6B9A]/70 bg-white/[0.09]" : "border-white/10 bg-white/[0.055] hover:border-white/20 hover:bg-white/[0.08]"}`}>
      <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={panelId} className="flex w-full items-center justify-between gap-3 text-left">
        <h4 className="font-extrabold text-white">{item.name}</h4>
        <span aria-hidden className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm transition ${open ? "rotate-180 bg-[#FF6B9A] text-[#0B2A47]" : "bg-white/10 text-white"}`}>⌄</span>
      </button>

      <p className="mb-3 mt-5 text-xs font-extrabold uppercase tracking-wider text-[#FF6B9A]">Explore</p>
      <div className="flex flex-wrap gap-2">
        {item.cities.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={open && city === c}
            onClick={() => onCity(c)}
            className={`rounded-full px-3 py-2 text-xs transition ${open && city === c ? "bg-[#FF6B9A] font-bold text-[#0B2A47]" : "bg-white/[0.07] text-[#DEE4EA] hover:bg-[#FF6B9A] hover:text-[#0B2A47]"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {open && (
        <div id={panelId} role="region" aria-label={`${board} school types`} className="vv-pop mt-5 rounded-xl border border-[#FF6B9A]/40 bg-[#071f36] p-4">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF6B9A]">{board}{city ? ` · ${city}` : ""}</p>
          <p className="mt-1 text-sm font-bold text-white">Choose school type</p>
          <div className="mt-3 space-y-2">
            {TYPE_OPTIONS.map((t) => (
              <Link
                key={t.value}
                href={schoolsHref({ board, type: t.value, ...place })}
                className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.07] px-3 py-2.5 text-sm text-[#DEE4EA] transition hover:bg-[#FF6B9A] hover:text-[#0B2A47]"
              >
                <span><span aria-hidden>{t.icon}</span> {t.label}</span>
                <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
          <Link href={schoolsHref({ board, ...place })} className="mt-3 inline-block text-xs font-bold text-[#8FD3F5] underline underline-offset-2 hover:text-white">
            View all {board} schools{city ? ` in ${city}` : ""} →
          </Link>
        </div>
      )}
    </div>
  );
}

const features = [
  {
    icon: "⚖️",
    title: "Compare schools",
    description: "Shortlist and compare boards, fees and facilities side by side.",
    href: "/compare",
  },
  {
    icon: "💬",
    title: "Parent reviews",
    description: "Read family feedback before making your decision.",
    href: "/schools",
  },
  {
    icon: "🧭",
    title: "Admission guidance",
    description: "Get help understanding documents, dates and campus visits.",
    href: "/admission-guide",
  },
  {
    icon: "📞",
    title: "Free counselling",
    description: "Get guidance to create your personalised school shortlist.",
    href: "/counselling",
  },
];

export default function Footer() {
  const [activeTab, setActiveTab] = useState<BrowseTab>("region");
  const [openBoard, setOpenBoard] = useState<string | null>(null);
  const [boardCity, setBoardCity] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const browseItems =
    activeTab === "region" ? regions : activeTab === "board" ? boards : popular;

  function subscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    // Connect to a newsletter API before collecting real subscriptions.
    setMessage("Newsletter signup UI is ready to connect to your backend.");
  }

  return (
    <footer className="relative overflow-hidden bg-[#0B2A47] text-white">
      <div className="pointer-events-none absolute bottom-0 right-0 select-none text-[180px] font-black leading-none text-white/[0.025] sm:text-[260px]">
        VV
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Quick links */}
        <div className="grid gap-4 border-b border-white/10 py-10 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <Link
              href={feature.href}
              key={feature.title}
              className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.055] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#FF6B9A]/60 hover:bg-white/[0.09]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B9A] to-[#EC0E58] text-xl shadow-lg">
                {feature.icon}
              </span>

              <span>
                <span className="block font-extrabold text-white">
                  {feature.title}
                </span>
                <span className="mt-1.5 block text-sm leading-6 text-[#C5CED8]">
                  {feature.description}
                </span>
              </span>
            </Link>
          ))}
        </div>

        {/* Main footer */}
        <div className="grid gap-12 border-b border-white/10 py-12 lg:grid-cols-[1.35fr_0.8fr_1fr_0.8fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center rounded-2xl bg-white px-5 py-3 shadow-lg" aria-label="VidyaVista home">
              <img
                src="/logo.png"
                alt="VidyaVista - Discover | Learn | Grow"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#CDD4DD]">
              Helping families discover, compare and choose the right school
              for their child.
            </p>

            <p className="mt-3 max-w-sm text-sm leading-7 text-[#A5B0BD]">
              Explore schools by region, board, city and admission needs, all
              in one place.
            </p>

            <div className="mt-6 flex gap-3">
              {[
                { label: "Instagram", text: "ig" },
                { label: "LinkedIn", text: "in" },
                { label: "YouTube", text: "▶" },
                { label: "X", text: "X" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white transition hover:border-[#FF6B9A] hover:bg-[#FF6B9A] hover:text-[#0B2A47]"
                >
                  {social.text}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <form onSubmit={subscribe} className="mt-7 max-w-md">
              <label
                htmlFor="footer-email"
                className="mb-3 block text-sm font-bold text-white"
              >
                Get admission alerts and school guides
              </label>

              <div className="flex gap-2 rounded-2xl border border-white/15 bg-white/[0.07] p-2">
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setMessage("");
                  }}
                  placeholder="Your email address"
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-[#A5B0BD]"
                  required
                />

                <button
                  type="submit"
                  className="rounded-xl bg-[#FF6B9A] px-4 py-3 text-sm font-extrabold text-[#0B2A47] transition hover:bg-[#FFE3EC]"
                >
                  Subscribe
                </button>
              </div>

              <p aria-live="polite" className="mt-2 text-xs text-[#CDD4DD]">
                {message}
              </p>
            </form>

            <div className="mt-4 space-y-2 text-sm text-[#CDD4DD]">
              <p>✉ hello@vidyavista.example</p>
              <p>☎ Contact details coming soon</p>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#FF6B9A]">
              Explore
            </h3>
            <div className="mt-6 flex flex-col gap-4 text-sm text-[#CDD4DD]">
              <Link className="hover:text-white" href="/schools">Explore All Schools</Link>
              <Link className="hover:text-white" href="/compare">Compare Schools</Link>
              <Link className="hover:text-white" href="/counselling">Get Counselling</Link>
              <Link className="hover:text-white" href="/parents-guide">Parent&apos;s Guide</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#FF6B9A]">
              Admission Resources
            </h3>
            <div className="mt-6 flex flex-col gap-4 text-sm text-[#CDD4DD]">
              <Link className="hover:text-white" href="/admission-guide">School Admission Guide</Link>
              <Link className="hover:text-white" href="/admission-process">Admission Process</Link>
              <Link className="hover:text-white" href="/documents-required">Documents Required</Link>
              <Link className="hover:text-white" href="/school-fees-guide">School Fees Guide</Link>
              <Link className="hover:text-white" href="/faqs">FAQs</Link>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#FF6B9A]">
              About VidyaVista
            </h3>
            <div className="mt-6 flex flex-col gap-4 text-sm text-[#CDD4DD]">
              <Link className="hover:text-white" href="/about">About Us</Link>
              <Link className="hover:text-white" href="/contact">Contact Us</Link>
              <Link className="hover:text-white" href="/list-school">List Your School</Link>
              <Link className="hover:text-white" href="/support">Help &amp; Support</Link>
            </div>
          </div>
        </div>

        {/* Browse schools */}
        <div className="border-b border-white/10 py-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#FF6B9A]">
              Browse Schools
            </h3>

            <div className="flex flex-wrap gap-2">
              {[
                { id: "region", label: "By Region" },
                { id: "board", label: "By Board" },
                { id: "popular", label: "Popular Searches" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActiveTab(tab.id as BrowseTab); setOpenBoard(null); setBoardCity(null); }}
                  className={`rounded-full border px-5 py-3 text-sm font-bold transition ${
                    activeTab === tab.id
                      ? "border-[#FF6B9A] bg-[#FF6B9A] text-[#0B2A47]"
                      : "border-white/15 bg-white/[0.04] text-[#CDD4DD] hover:border-[#FF6B9A]/60 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {activeTab === "board" && boards.map((item) => (
              <BoardCard
                key={item.name}
                item={item}
                open={openBoard === item.name}
                city={openBoard === item.name ? boardCity : null}
                onToggle={() => { setOpenBoard(openBoard === item.name ? null : item.name); setBoardCity(null); }}
                onCity={(c) => {
                  if (openBoard === item.name && boardCity === c) setBoardCity(null);
                  else { setOpenBoard(item.name); setBoardCity(c); }
                }}
              />
            ))}
            {activeTab !== "board" && browseItems.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <h4 className="font-extrabold text-white">{item.name}</h4>

                {activeTab === "region" && (
                  <>
                    <p className="mb-3 mt-5 text-xs font-extrabold uppercase tracking-wider text-[#FF6B9A]">
                      School types
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(("types" in item ? item.types : []) as string[]).map((type: string) => (
                        <Link
                          key={type}
                          href={schoolsHref({ type: TYPE_BY_LABEL[type] })}
                          className="rounded-full bg-white/[0.07] px-3 py-2 text-xs text-[#DEE4EA] transition hover:bg-[#FF6B9A] hover:text-[#0B2A47]"
                        >
                          {type}
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                <p className="mb-3 mt-5 text-xs font-extrabold uppercase tracking-wider text-[#FF6B9A]">
                  {activeTab === "region" ? "Popular cities" : "Explore"}
                </p>

                <div className="flex flex-wrap gap-2">
                  {item.cities.map((city) => (
                    <Link
                      key={city}
                      href={activeTab === "popular" ? schoolsHref({ type: TYPE_BY_LABEL[city] }) : schoolsHref(placeParams(city))}
                      className="rounded-full bg-white/[0.07] px-3 py-2 text-xs text-[#DEE4EA] transition hover:bg-[#FF6B9A] hover:text-[#0B2A47]"
                    >
                      {city}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-b border-white/10 py-6 text-xs leading-6 text-[#A5B0BD]">
          Fees, ratings and facilities shown on VidyaVista are indicative and
          may change. Please confirm all details directly with the school
          before applying.
        </div>

        {/* Bottom links */}
        <div className="flex flex-col gap-5 py-7 text-sm text-[#B6BFCA] lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} VidyaVista. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
            <Link href="/contact" className="hover:text-white">Contact Us</Link>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rounded-full border border-white/20 px-5 py-3 font-bold text-white transition hover:border-[#FF6B9A] hover:bg-[#FF6B9A] hover:text-[#0B2A47]"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
