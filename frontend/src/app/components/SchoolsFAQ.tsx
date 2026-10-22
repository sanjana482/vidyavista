"use client";

import { useState } from "react";
import { listingFaqs as faqs } from "../data/faqs";


export default function SchoolsFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="reviews" className="bg-gradient-to-b from-[#F6FAFD] to-[#FDE8EF]/60 py-16">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#EC0E58]">Got questions?</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B2A47] sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-3 text-[#626F7D]">Quick answers to the questions parents ask most about choosing a school and applying.</p>
        </div>
        <div className="mt-8 space-y-3">
          {faqs.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <article key={q} className={`rounded-2xl border bg-white transition ${isOpen ? "border-[#0795DC] shadow-md shadow-[#0795DC]/10" : "border-[#E1E7EE] hover:border-[#9ED8F5]"}`}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="font-bold text-[#0B2A47]">{q}</span>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg transition ${isOpen ? "rotate-45 bg-[#EC0E58] text-white" : "bg-[#E1F1FA] text-[#0A5C91]"}`}>+</span>
                </button>
                {isOpen && <p className="px-6 pb-5 leading-7 text-[#626F7D]">{a}</p>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
