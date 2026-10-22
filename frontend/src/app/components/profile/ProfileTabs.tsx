"use client";

import { useEffect, useState } from "react";

const TABS = [
  ["about", "About"], ["fees", "Fees"], ["facilities", "Facilities"], ["admission", "Admission"],
  ["contact", "Contact"], ["photos", "Photos"], ["reviews", "Reviews"], ["faqs", "FAQs"],
];

export default function ProfileTabs() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const els = TABS.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-170px 0px -60% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="sticky top-[76px] z-40 border-b border-[#E1E7EE] bg-white/95 backdrop-blur sm:top-[80px]">
      <nav aria-label="Profile sections" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 lg:px-8">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            aria-current={active === id}
            className={`shrink-0 border-b-[3px] px-5 py-4 text-sm font-bold transition ${
              active === id ? "border-[#EC0E58] text-[#0B2A47]" : "border-transparent text-[#5C6A7B] hover:text-[#0A7BBF]"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
