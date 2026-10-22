"use client";

import { openEnquiry } from "./enquiry";

export default function EnquiryButton({ children, className, cls }: { children: React.ReactNode; className?: string; cls?: string }) {
  return (
    <button type="button" onClick={() => openEnquiry(cls)} className={className}>
      {children}
    </button>
  );
}
