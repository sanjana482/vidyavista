
"use client";

import { useState } from "react";
import { homeFaqs as faqs } from "../data/faqs";


export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-gradient-to-b from-white via-[#FAF5F7] to-[#FFE3EC] py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
        {/* Left content */}
        <div>
          <span className="inline-flex rounded-full bg-[#F5DDE5] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#C8104F]">
            Need help?
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#0B2A47] sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 max-w-md leading-7 text-[#626F7D]">
            Everything you need to know about discovering, comparing and
            choosing schools with VidyaVista.
          </p>

          <div className="mt-7 rounded-2xl border border-[#D9E0E8] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5EBF1] text-xl">
                💬
              </span>
              <div>
                <p className="font-bold text-[#0B2A47]">
                  Still have questions?
                </p>
                <p className="mt-1 text-sm text-[#707E8F]">
                  Our counselling team can help.
                </p>
              </div>
            </div>

            <a
              href="/counselling"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0B2A47] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#475E78]"
            >
              Get Counselling <span>→</span>
            </a>
          </div>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;

            return (
              <article
                key={faq.question}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-[#FF6B9A] bg-white shadow-md shadow-[#0B2A47]/5"
                    : "border-[#DFE3E8] bg-white/80 hover:border-[#FF6B9A]"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <span className="font-bold leading-6 text-[#0B2A47]">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg transition ${
                      isOpen
                        ? "rotate-45 bg-[#0B2A47] text-white"
                        : "bg-[#F4E8EC] text-[#C8104F]"
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={answerId}
                    className="px-5 pb-5 sm:px-6"
                  >
                    <div className="mb-4 h-px bg-[#E6EAEE]" />
                    <p className="text-sm leading-7 text-[#626F7D]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
