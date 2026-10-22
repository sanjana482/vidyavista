
"use client";

import { useState } from "react";

type ListingDescriptionProps = {
  description: string;
  maxLength?: number;
};

export default function ListingDescription({
  description,
  maxLength = 300,
}: ListingDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = description.length > maxLength;

  const visibleDescription =
    expanded || !shouldTruncate
      ? description
      : description.slice(0, maxLength).trimEnd() + "...";

  return (
    <div className="max-w-5xl">
      <p className="text-sm leading-7 text-[#626F7D] sm:text-base">
        {visibleDescription}
      </p>

      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setExpanded((previous) => !previous)}
          className="mt-2 font-semibold text-[#475E78] underline-offset-4 transition hover:text-[#0B2A47] hover:underline"
        >
          {expanded ? "Read less ↑" : "Read more ↓"}
        </button>
      )}
    </div>
  );
}
