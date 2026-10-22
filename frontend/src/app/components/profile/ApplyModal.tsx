"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { rupee, type FeeSlab } from "../../data/profile";
import { postEnquiry } from "../../lib/api";

type Session = "2027-28" | "2026-27";

type Props = {
  schoolName: string;
  city: string;
  status: string; // e.g. "Dates not announced yet"
  classes: string[];
  slabs: Record<Session, FeeSlab[]>;
};

const STEPS = ["Child", "Parent", "Review"];
const NOTE_MAX = 500;

const INITIAL = {
  child: "", cls: "", session: "2027-28" as Session,
  parent: "", role: "Mother", mobile: "", email: "", city: "",
  note: "", terms: false,
};


export default function ApplyModal({ schoolName, city, status, classes, slabs }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [f, setF] = useState(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [done, setDone] = useState(false);

  const dialog = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const set = <K extends keyof typeof INITIAL>(k: K, v: (typeof INITIAL)[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    if (errors[k as string]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  // open from any "Enquire" button
  useEffect(() => {
    function onApply(e: Event) {
      const cls = ((e as CustomEvent).detail as { cls?: string } | undefined)?.cls;
      lastFocus.current = document.activeElement as HTMLElement;
      if (cls) setF((p) => ({ ...p, cls }));
      setOpen(true);
    }
    window.addEventListener("vv-apply", onApply);
    return () => window.removeEventListener("vv-apply", onApply);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    if (done) {
      setF(INITIAL); setStep(0); setDone(false); setErrors({});
    }
    setSendError("");
    setTimeout(() => lastFocus.current?.focus?.(), 0);
  }, [done]);

  // scroll lock, ESC, focus trap, initial focus
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => dialog.current?.querySelector<HTMLElement>("input,select,textarea,button[data-autofocus]")?.focus(), 60);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && dialog.current) {
        const els = Array.from(dialog.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter((el) => el.offsetParent !== null);
        if (!els.length) return;
        const first = els[0], last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open, step, done, close]);

  function validate(s: number) {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (f.child.trim().length < 2) e.child = "Please enter your child's name.";
      if (!f.cls) e.cls = "Please select a class.";
    }
    if (s === 1) {
      if (f.parent.trim().length < 2) e.parent = "Please enter your name.";
      if (!/^[6-9]\d{9}$/.test(f.mobile)) e.mobile = "Enter a valid 10-digit mobile number.";
      if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
      if (f.city.trim().length < 2) e.city = "Please enter your city.";
    }
    if (s === 2 && !f.terms) e.terms = "Please accept the Terms & Conditions to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const next = () => { if (validate(step)) setStep(step + 1); };
  const back = () => { setErrors({}); setStep(step - 1); };
  const goto = (s: number) => { if (s < step) { setErrors({}); setStep(s); } };

  async function submit() {
    if (!validate(2)) {
      setTimeout(() => document.getElementById("ap-terms")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }
    setSending(true); setSendError("");
    try {
      const res = await postEnquiry({
        schoolName,
        childName: f.child,
        className: f.cls,
        session: f.session,
        parentName: f.parent,
        relation: f.role,
        mobile: f.mobile,
        email: f.email,
        city: f.city,
        note: f.note,
      });
      if (!res.ok) throw new Error("failed");
      setDone(true);
    } catch {
      setSendError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  const slab = slabs[f.session].find((x) => x.cls === f.cls);
  const field = (bad?: string) =>
    `mt-2 h-12 w-full rounded-xl border bg-white px-4 text-[15px] text-[#0B2A47] outline-none transition placeholder:text-[#8896A6] focus:ring-4 ${
      bad ? "border-[#EC0E58] focus:ring-[#EC0E58]/15" : "border-[#D6DDE5] focus:border-[#0795DC] focus:ring-[#0795DC]/15"
    }`;
  const label = "block text-sm font-bold text-[#0B2A47]";
  const Err = ({ k }: { k: string }) => (errors[k] ? <p role="alert" className="mt-1.5 text-[13px] font-semibold text-[#C8104F]">{errors[k]}</p> : null);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#071b2e]/70 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="apply-title" className="flex max-h-[94vh] w-full max-w-[700px] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl shadow-[#0B2A47]/40 sm:rounded-[28px]">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#0795DC] to-[#EC0E58]" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pb-2 pt-6 sm:px-8">
          <div>
            <h2 id="apply-title" className="text-2xl font-extrabold leading-tight tracking-tight text-[#0B2A47] sm:text-[1.7rem]">
              {done ? "Enquiry sent" : `Apply to ${schoolName}`}
            </h2>
            <p className="mt-1.5 text-sm text-[#5C6A7B]">Session {f.session} · {status}</p>
          </div>
          <button type="button" onClick={close} aria-label="Close" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E9F3FA] text-lg text-[#0A5C91] transition hover:bg-[#FDE8EF] hover:text-[#C8104F]">✕</button>
        </div>

        {!done && (
          <ol className="grid grid-cols-3 gap-3 px-6 pt-4 sm:px-8" aria-label="Progress">
            {STEPS.map((s, i) => {
              const state = i < step ? "done" : i === step ? "now" : "todo";
              return (
                <li key={s}>
                  <button type="button" disabled={state !== "done"} onClick={() => goto(i)} aria-current={state === "now" ? "step" : undefined} className="block w-full text-left disabled:cursor-default">
                    <span className={`block h-1 rounded-full transition-colors ${state === "done" ? "bg-[#0795DC]" : state === "now" ? "bg-[#EC0E58]" : "bg-[#E1E7EE]"}`} />
                    <span className={`mt-2.5 flex items-center gap-1.5 text-[13px] font-bold ${state === "now" ? "text-[#0B2A47]" : state === "done" ? "text-[#0A7BBF]" : "text-[#8896A6]"}`}>
                      {state === "done" ? <span aria-hidden>✓</span> : null}{i + 1}. {s}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {done ? (
            <div role="status" className="py-4 text-center">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0795DC] to-[#EC0E58] text-4xl text-white shadow-xl shadow-[#0795DC]/30">✓</span>
              <h3 className="mt-6 text-2xl font-extrabold text-[#0B2A47]">Thank you, {f.parent.split(" ")[0]}!</h3>
              <p className="mx-auto mt-3 max-w-md leading-7 text-[#5C6A7B]">
                Your enquiry for <strong className="text-[#0B2A47]">{f.child}</strong> ({f.cls}, {f.session}) has been shared with {schoolName}. Expect a call on <strong className="text-[#0B2A47]">+91 {f.mobile}</strong>.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button type="button" data-autofocus onClick={close} className="rounded-xl bg-gradient-to-r from-[#0A5C91] to-[#0795DC] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#0A5C91]/25">Done</button>
                <Link href={`/schools?city=${encodeURIComponent(city)}`} className="rounded-xl border border-[#D6DDE5] px-7 py-3.5 text-sm font-bold text-[#0B2A47] transition hover:border-[#0795DC] hover:text-[#0A7BBF]">Explore similar schools</Link>
              </div>
            </div>
          ) : step === 0 ? (
            <div>
              <h3 className="text-xl font-extrabold text-[#0B2A47]">Child details</h3>
              <div className="mt-5">
                <label htmlFor="ap-child" className={label}>Child&apos;s name</label>
                <input id="ap-child" value={f.child} onChange={(e) => set("child", e.target.value)} onKeyDown={(e) => e.key === "Enter" && next()} className={field(errors.child)} autoComplete="off" />
                <Err k="child" />
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ap-cls" className={label}>Admission for class</label>
                  <select id="ap-cls" value={f.cls} onChange={(e) => set("cls", e.target.value)} className={field(errors.cls)}>
                    <option value="">Select class</option>
                    {classes.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <Err k="cls" />
                </div>
                <div>
                  <label htmlFor="ap-ses" className={label}>Academic session</label>
                  <select id="ap-ses" value={f.session} onChange={(e) => set("session", e.target.value as Session)} className={field()}>
                    <option>2027-28</option><option>2026-27</option>
                  </select>
                </div>
              </div>
              {slab && (
                <div role="status" className="vv-pop mt-6 rounded-2xl bg-gradient-to-br from-[#E6F4FC] to-[#FDE8EF] px-5 py-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0A5C91]">Estimated fee · {slab.cls} · {f.session}</p>
                  <p className="mt-1.5 text-[15px] text-[#0B2A47]">
                    <strong className="font-extrabold">{rupee(slab.monthly)} / month</strong> · <strong className="font-extrabold">{rupee(slab.annual)} / year</strong>
                  </p>
                  <p className="mt-1 text-[13px] text-[#5C6A7B]">This is an estimate. Final fees are confirmed by the school.</p>
                </div>
              )}
            </div>
          ) : step === 1 ? (
            <div>
              <h3 className="text-xl font-extrabold text-[#0B2A47]">Parent / guardian details</h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ap-p" className={label}>Your name</label>
                  <input id="ap-p" value={f.parent} onChange={(e) => set("parent", e.target.value)} className={field(errors.parent)} autoComplete="name" />
                  <Err k="parent" />
                </div>
                <div>
                  <label htmlFor="ap-r" className={label}>You are the</label>
                  <select id="ap-r" value={f.role} onChange={(e) => set("role", e.target.value)} className={field()}>
                    <option>Mother</option><option>Father</option><option>Guardian</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ap-m" className={label}>Mobile number</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-[1.15rem] text-[15px] font-semibold text-[#5C6A7B]">+91</span>
                    <input id="ap-m" inputMode="numeric" value={f.mobile} onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} className={`${field(errors.mobile)} pl-14`} autoComplete="tel-national" placeholder="10-digit number" />
                  </div>
                  <Err k="mobile" />
                </div>
                <div>
                  <label htmlFor="ap-e" className={label}>Email (optional)</label>
                  <input id="ap-e" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} className={field(errors.email)} autoComplete="email" />
                  <Err k="email" />
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="ap-c" className={label}>Your city</label>
                <input id="ap-c" value={f.city} onChange={(e) => set("city", e.target.value)} className={field(errors.city)} autoComplete="address-level2" />
                <Err k="city" />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-extrabold text-[#0B2A47]">Review and submit</h3>

              <dl className="mt-5 divide-y divide-[#E1E7EE] overflow-hidden rounded-2xl border border-[#E1E7EE] bg-[#F6FAFD]">
                {[
                  ["School", schoolName, null],
                  ["Child", f.child, 0],
                  ["Class", f.cls, 0],
                  ["Session", f.session, 0],
                  ["Parent", `${f.parent} (${f.role})`, 1],
                  ["Mobile", `+91 ${f.mobile}`, 1],
                  ["Email", f.email || "Not provided", 1],
                  ["City", f.city, 1],
                ].map(([k, v, s]) => (
                  <div key={k as string} className="grid grid-cols-[96px_1fr_auto] items-center gap-3 px-5 py-3 text-[15px]">
                    <dt className="text-[#5C6A7B]">{k}</dt>
                    <dd className="min-w-0 break-words font-bold text-[#0B2A47]">{v}</dd>
                    {s !== null ? <button type="button" onClick={() => goto(s as number)} className="text-xs font-extrabold text-[#0A7BBF] hover:text-[#EC0E58]">Edit</button> : <span />}
                  </div>
                ))}
              </dl>

              <div className="mt-6">
                <label htmlFor="ap-note" className={label}>Message for the school <span className="font-semibold text-[#8896A6]">(optional)</span></label>
                <textarea id="ap-note" rows={4} maxLength={NOTE_MAX} value={f.note} onChange={(e) => set("note", e.target.value)}
                  placeholder="Write a short message for the school, e.g. your questions about admission, fees, transport or a campus visit."
                  className="mt-2 w-full resize-none rounded-xl border border-[#D6DDE5] bg-white px-4 py-3 text-[15px] text-[#0B2A47] outline-none transition placeholder:text-[#8896A6] focus:border-[#0795DC] focus:ring-4 focus:ring-[#0795DC]/15" />
                <p className="mt-1 text-right text-xs text-[#8896A6]">{f.note.length}/{NOTE_MAX}</p>
              </div>

              {/* Single Terms checkbox */}
              <label id="ap-terms" className={`mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm leading-6 transition ${errors.terms ? "border-[#EC0E58] bg-[#FDF0F5]" : f.terms ? "border-[#0795DC] bg-[#F1F9FE]" : "border-[#E1E7EE] bg-white hover:border-[#9ED8F5]"}`}>
                <input type="checkbox" checked={f.terms} onChange={(e) => set("terms", e.target.checked)} className="mt-1 h-[18px] w-[18px] shrink-0 accent-[#0795DC]" />
                <span className="text-[#4E5A68]">
                  I agree to the{" "}
                  <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-bold text-[#0A7BBF] underline underline-offset-2 hover:text-[#EC0E58]">Terms &amp; Conditions</Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-bold text-[#0A7BBF] underline underline-offset-2 hover:text-[#EC0E58]">Privacy Policy</Link>, and allow VidyaVista and this school to contact me about this enquiry.
                </span>
              </label>
              <Err k="terms" />
              {sendError && <p role="alert" className="mt-3 text-sm font-semibold text-[#C8104F]">{sendError}</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="flex items-center justify-between gap-3 border-t border-[#E1E7EE] bg-white px-6 py-4 sm:px-8">
            {step > 0 ? (
              <button type="button" onClick={back} className="rounded-xl border border-[#D6DDE5] px-6 py-3.5 text-sm font-bold text-[#0B2A47] transition hover:border-[#0795DC] hover:text-[#0A7BBF]">Back</button>
            ) : <span />}
            {step < 2 ? (
              <button type="button" onClick={next} className="rounded-xl bg-gradient-to-r from-[#0A5C91] to-[#0795DC] px-9 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#0A5C91]/25 transition hover:-translate-y-0.5">Continue</button>
            ) : (
              <button type="button" onClick={submit} disabled={sending} className="rounded-xl bg-[#EC0E58] px-8 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#EC0E58]/30 transition hover:-translate-y-0.5 hover:bg-[#C8104F] disabled:cursor-wait disabled:opacity-70">
                {sending ? "Sending…" : "Submit enquiry"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
