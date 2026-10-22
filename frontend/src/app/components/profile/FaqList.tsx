"use client";

import { useState } from "react";

export default function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <article key={f.q} className={`rounded-2xl border bg-white transition ${isOpen ? "border-[#0795DC] shadow-md shadow-[#0795DC]/10" : "border-[#E1E7EE] hover:border-[#9ED8F5]"}`}>
            <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6">
              <span className="font-bold text-[#0B2A47]">{f.q}</span>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg transition ${isOpen ? "rotate-45 bg-[#EC0E58] text-white" : "bg-[#E1F1FA] text-[#0A5C91]"}`}>+</span>
            </button>
            {isOpen && <p className="px-5 pb-5 leading-7 text-[#5C6A7B] sm:px-6">{f.a}</p>}
          </article>
        );
      })}
    </div>
  );
}
