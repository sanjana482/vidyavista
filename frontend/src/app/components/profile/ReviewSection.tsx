"use client";

import { useState } from "react";

type Props = { schoolName: string; rating: number; count: number };

export default function ReviewSection({ schoolName, rating, count }: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [f, setF] = useState({ name: "", role: "Parent", mobile: "", email: "", text: "", confirm: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!stars) err.stars = "Please choose a rating";
    if (f.name.trim().length < 2) err.name = "Please enter your name";
    if (!/^[6-9]\d{9}$/.test(f.mobile)) err.mobile = "Enter a valid 10-digit mobile number";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) err.email = "Enter a valid email";
    if (f.text.trim().length < 20) err.text = "Please write at least 20 characters";
    if (!f.confirm) err.confirm = "Please confirm this is your genuine experience";
    setErrors(err);
    if (Object.keys(err).length) return;
    // TODO: POST { schoolName, stars, ...f } to your reviews API (with mobile OTP verification).
    setDone(true);
  }

  const input = (bad?: string) =>
    `mt-2 w-full rounded-xl border bg-white px-4 text-sm text-[#0B2A47] outline-none focus:ring-4 ${
      bad ? "border-[#EC0E58] focus:ring-[#EC0E58]/15" : "border-[#D6DDE5] focus:border-[#0795DC] focus:ring-[#0795DC]/15"
    }`;
  const label = "block text-sm font-bold text-[#0B2A47]";
  const Err = ({ k }: { k: string }) => (errors[k] ? <p className="mt-1 text-xs font-semibold text-[#C8104F]">{errors[k]}</p> : null);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#0B2A47]">Parent reviews</h2>
        <button type="button" onClick={() => setFormOpen(true)} className="rounded-xl border border-[#D6DDE5] bg-white px-5 py-3 text-sm font-bold text-[#0B2A47] transition hover:border-[#0795DC] hover:text-[#0A7BBF]">
          Write a review
        </button>
      </div>

      {count > 0 ? (
        <div className="mt-5 flex flex-wrap items-center gap-5 rounded-2xl border border-[#E1E7EE] bg-[#F6FAFD] px-6 py-5">
          <p className="text-5xl font-extrabold text-[#0B2A47]">{rating}<span className="text-xl font-bold text-[#8896A6]"> / 5</span></p>
          <div>
            <p className="text-xl tracking-wider text-[#E99A24]" aria-label={`${rating} out of 5 stars`}>
              {"★".repeat(Math.round(rating))}<span className="text-[#D6DDE5]">{"★".repeat(5 - Math.round(rating))}</span>
            </p>
            <p className="mt-1 text-sm text-[#5C6A7B]">Based on {count} parent reviews of {schoolName}</p>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-[#E1E7EE] bg-[#F6FAFD] px-6 py-5 text-[#4E5A68]">
          No reviews yet. Be the first parent to share your experience.
        </div>
      )}

      {(formOpen || count === 0) && (
        <div className="mt-5 rounded-3xl border border-[#E1E7EE] bg-white p-6 shadow-sm sm:p-8">
          {done ? (
            <div role="status" className="py-6 text-center">
              <p className="text-4xl">🎉</p>
              <p className="mt-3 text-xl font-extrabold text-[#0A5C91]">Thank you for sharing your experience!</p>
              <p className="mt-2 text-sm text-[#5C6A7B]">Your review will appear after verification.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h3 className="text-xl font-extrabold text-[#0B2A47]">Share your experience</h3>

              <p className={`${label} mt-5`}>Your rating</p>
              <div className="mt-2 flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n} type="button" aria-label={`${n} star${n > 1 ? "s" : ""}`} aria-pressed={stars === n}
                    onMouseEnter={() => setHover(n)} onClick={() => setStars(n)}
                    className={`text-4xl leading-none transition ${(hover || stars) >= n ? "text-[#E99A24]" : "text-[#D0D6DD]"}`}
                  >★</button>
                ))}
              </div>
              <Err k="stars" />

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="rn" className={label}>Your name</label>
                  <input id="rn" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={`${input(errors.name)} h-12`} />
                  <Err k="name" />
                </div>
                <div>
                  <label htmlFor="rr" className={label}>You are a</label>
                  <select id="rr" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} className={`${input()} h-12`}>
                    <option>Parent</option><option>Student</option><option>Alumni</option><option>Staff</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="rm" className={label}>Mobile number (for verification, not shown)</label>
                  <input id="rm" inputMode="numeric" value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })} className={`${input(errors.mobile)} h-12`} />
                  <Err k="mobile" />
                </div>
                <div>
                  <label htmlFor="re" className={label}>Email (optional, not shown)</label>
                  <input id="re" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={`${input(errors.email)} h-12`} />
                  <Err k="email" />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="rt" className={label}>Your review</label>
                <textarea id="rt" rows={5} value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} placeholder="Tell other parents about teaching, facilities, fees, safety and admission process." className={`${input(errors.text)} py-3`} />
                <Err k="text" />
              </div>

              <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-[#4E5A68]">
                <input type="checkbox" checked={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.checked })} className="mt-0.5 h-4 w-4 accent-[#0795DC]" />
                I confirm this is my genuine experience with this school and I was not paid or rewarded for this review.
              </label>
              <Err k="confirm" />

              <button type="submit" className="mt-6 rounded-xl bg-gradient-to-r from-[#0A5C91] to-[#0795DC] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#0A5C91]/25 transition hover:-translate-y-0.5">
                Submit review
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
