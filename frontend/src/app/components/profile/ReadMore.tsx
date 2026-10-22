"use client";

import { useState } from "react";

export default function ReadMore({ paragraphs }: { paragraphs: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className={`relative space-y-4 leading-8 text-[#5C6A7B] ${open ? "" : "max-h-[11.5rem] overflow-hidden"}`}>
        {paragraphs.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
        {!open && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />}
      </div>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="mt-4 text-sm font-extrabold text-[#0A5C91] transition hover:text-[#EC0E58]">
        {open ? "Read less ▴" : "Read more ▾"}
      </button>
    </div>
  );
}
