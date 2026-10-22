"use client";

import { useRef, useState } from "react";
import { openEnquiry } from "./enquiry";
import { postEnquiry } from "../../lib/api";

type Props = {
  schoolName: string;
  feeRange: string;
  phone: string;
  phoneHref: string;
  classes: string[];
};

export default function EnquirySidebar({ schoolName, feeRange, phone, phoneHref, classes }: Props) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cls, setCls] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (name.trim().length < 2) err.name = "Please enter the parent's name";
    if (!/^[6-9]\d{9}$/.test(mobile)) err.mobile = "Enter a valid 10-digit mobile number";
    if (!cls) err.cls = "Please select a class";
    setErrors(err);
    if (Object.keys(err).length) return;
    try {
      await postEnquiry({ schoolName, parentName: name.trim(), mobile, className: cls });
      setDone(true);
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    }
  }

  const input = (bad?: string) =>
    `mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-[#0B2A47] outline-none placeholder:text-[#8896A6] focus:ring-4 ${
      bad ? "border-[#EC0E58] focus:ring-[#EC0E58]/15" : "border-[#D6DDE5] focus:border-[#0795DC] focus:ring-[#0795DC]/15"
    }`;
  const label = "block text-sm font-bold text-[#0B2A47]";

  return (
    <aside className="lg:sticky lg:top-[160px] lg:self-start">
      <div className="rounded-3xl border border-[#E1E7EE] bg-white p-6 shadow-xl shadow-[#0B2A47]/5">
        <h2 className="text-xl font-extrabold text-[#0B2A47]">Interested in this school?</h2>
        <p className="mt-2 text-sm text-[#5C6A7B]">Get free guidance from a school counsellor.</p>

        <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#E1F1FA] to-[#FDE8EF] px-5 py-4">
          <p className="text-xs text-[#4E5A68]">Annual fee range</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0B2A47]">{feeRange} / year</p>
        </div>

        <button type="button" onClick={() => openEnquiry()} className="mt-5 w-full rounded-xl bg-[#EC0E58] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#EC0E58]/25 transition hover:bg-[#C8104F]">
          Enquire for 2027-28
        </button>
        <p className="mt-4 text-center text-sm text-[#5C6A7B]">or request a quick callback</p>

        {done ? (
          <div role="status" className="mt-4 rounded-2xl border border-[#9ED8F5] bg-[#EAF6FD] p-5 text-center">
            <p className="text-3xl">✅</p>
            <p className="mt-2 font-extrabold text-[#0A5C91]">Thank you, {name.split(" ")[0]}!</p>
            <p className="mt-1 text-sm text-[#4E5A68]">We&apos;ve received your request for {cls}. Our counsellor will contact you shortly.</p>
            <button type="button" onClick={() => { setDone(false); setName(""); setMobile(""); setCls(""); }} className="mt-3 text-sm font-bold text-[#0A7BBF] underline">
              Send another request
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-2 space-y-4">
            <div>
              <label htmlFor="pn" className={label}>Parent name</label>
              <input id="pn" ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} className={input(errors.name)} autoComplete="name" />
              {errors.name && <p className="mt-1 text-xs font-semibold text-[#C8104F]">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="pp" className={label}>Phone number</label>
              <input id="pp" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" placeholder="10-digit mobile number" className={input(errors.mobile)} autoComplete="tel-national" />
              {errors.mobile && <p className="mt-1 text-xs font-semibold text-[#C8104F]">{errors.mobile}</p>}
            </div>
            <div>
              <label htmlFor="pc" className={label}>Admission for class</label>
              <select id="pc" value={cls} onChange={(e) => setCls(e.target.value)} className={input(errors.cls)}>
                <option value="">Select class</option>
                {classes.map((c) => <option key={c}>{c}</option>)}
              </select>
              {errors.cls && <p className="mt-1 text-xs font-semibold text-[#C8104F]">{errors.cls}</p>}
            </div>
            {errors.form && <p role="alert" className="text-sm font-semibold text-[#C8104F]">{errors.form}</p>}
            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-[#0A5C91] to-[#0795DC] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#0A5C91]/25 transition hover:-translate-y-0.5">
              Request Callback
            </button>
            <p className="text-center text-xs text-[#707E8F]">Free counselling. No spam.</p>
          </form>
        )}

        <a href={`tel:${phoneHref}`} className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#9ED8F5] bg-[#EAF6FD] px-4 py-3.5 text-sm font-extrabold text-[#0A5C91] transition hover:bg-[#D7EEFA]">
          📞 Or call the school: {phone.split(" / ")[0]}
        </a>
      </div>
    </aside>
  );
}

