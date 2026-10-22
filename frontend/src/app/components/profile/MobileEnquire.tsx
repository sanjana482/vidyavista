"use client";

import { openEnquiry } from "./enquiry";

export default function MobileEnquire() {
  return (
    <button type="button" onClick={() => openEnquiry()} className="flex-1 rounded-xl bg-[#EC0E58] py-3.5 text-sm font-extrabold text-white">
      Enquire
    </button>
  );
}
