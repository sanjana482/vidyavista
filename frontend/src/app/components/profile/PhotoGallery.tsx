"use client";

import { useCallback, useEffect, useState } from "react";

export default function PhotoGallery({ images, name }: { images: string[]; name: string }) {
  const [idx, setIdx] = useState<number | null>(null);

  const close = useCallback(() => setIdx(null), []);
  const step = useCallback(
    (d: number) => setIdx((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [idx, close, step]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`Open photo ${i + 1} of ${name}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#E1F1FA] shadow-sm ring-0 transition hover:shadow-xl hover:shadow-[#0795DC]/20 focus-visible:ring-4 focus-visible:ring-[#0795DC]/40"
          >
            <img src={src} alt={`${name} photo ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-[#0B2A47]/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          </button>
        ))}
      </div>

      {idx !== null && (
        <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[70] flex items-center justify-center bg-[#071b2e]/95 p-4" onClick={close}>
          <button type="button" onClick={close} aria-label="Close" className="absolute right-5 top-5 rounded-full bg-white/15 px-4 py-2 text-lg text-white hover:bg-white/25">✕</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo" className="absolute left-3 rounded-full bg-white/15 px-4 py-3 text-2xl text-white hover:bg-[#EC0E58] sm:left-8">‹</button>
          <img src={images[idx]} alt={`${name} photo ${idx + 1}`} onClick={(e) => e.stopPropagation()} className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl" />
          <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo" className="absolute right-3 rounded-full bg-white/15 px-4 py-3 text-2xl text-white hover:bg-[#EC0E58] sm:right-8">›</button>
          <p className="absolute bottom-5 text-sm font-semibold text-white/80">{idx + 1} / {images.length}</p>
        </div>
      )}
    </>
  );
}
