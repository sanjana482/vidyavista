import type { Profile } from "../../data/profile";
import EnquiryButton from "./EnquiryButton";

export function Facilities({ p }: { p: Profile }) {
  return (
    <div>
      <h2 className="text-3xl font-extrabold tracking-tight text-[#0B2A47]">Facilities</h2>
      <div className="mt-6 space-y-7">
        {p.facilities.map((g) => (
          <div key={g.title}>
            <h3 className="flex items-center gap-2 font-extrabold text-[#0B2A47]"><span>{g.icon}</span>{g.title}</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {g.items.map((i) => (
                <span key={i} className="rounded-full border border-[#D6DDE5] bg-white px-5 py-3 text-sm text-[#4E5A68] transition hover:border-[#0795DC] hover:bg-[#F1F8FC] hover:text-[#0A5C91]">{i}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-[#707E8F]">Not available: {p.notAvailable.join(", ")}.</p>
    </div>
  );
}

export function Admission({ p }: { p: Profile }) {
  const a = p.admission;
  return (
    <div>
      <h2 className="text-3xl font-extrabold tracking-tight text-[#0B2A47]">Admission process 2027-28</h2>

      <div className="mt-5 rounded-2xl border border-[#E1E7EE] bg-[#F6FAFD] p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-lg px-3 py-1.5 text-xs font-extrabold ${a.tone === "pink" ? "bg-[#FDE8EF] text-[#C8104F]" : "bg-[#E1F1FA] text-[#0A5C91]"}`}>{a.status}</span>
          <span className="font-extrabold text-[#0B2A47]">Session 2027-28</span>
        </div>
        <p className="mt-3 leading-7 text-[#5C6A7B]">{a.summary}</p>
      </div>

      <ol className="mt-7">
        {a.steps.map((s, i) => (
          <li key={s.title} className="relative flex gap-5 pb-7 last:pb-0">
            {i < a.steps.length - 1 && <span className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#0795DC] to-[#F7B6CB]" aria-hidden />}
            <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0A5C91] to-[#0795DC] text-sm font-extrabold text-white shadow-md shadow-[#0795DC]/30">{i + 1}</span>
            <div>
              <h3 className="font-extrabold text-[#0B2A47]">{s.title}</h3>
              <p className="mt-1 leading-7 text-[#5C6A7B]">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-7 rounded-2xl border border-[#E1E7EE] bg-[#F6FAFD] p-6">
        <h3 className="font-extrabold text-[#0B2A47]">📄 Documents checklist</h3>
        <p className="mt-2 leading-7 text-[#5C6A7B]">{a.documents}</p>
      </div>
      <EnquiryButton className="mt-6 rounded-xl bg-[#EC0E58] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#EC0E58]/25 transition hover:bg-[#C8104F]">
        Enquire for 2027-28
      </EnquiryButton>
    </div>
  );
}

export function Contact({ p, name }: { p: Profile; name: string }) {
  const c = p.contact;
  const q = encodeURIComponent(`${name}, ${c.address}`);
  const card = "rounded-2xl border border-[#E1E7EE] bg-[#F6FAFD] p-5";
  const lbl = "text-[11px] font-extrabold uppercase tracking-wider text-[#5C6A7B]";
  return (
    <div>
      <h2 className="text-3xl font-extrabold tracking-tight text-[#0B2A47]">Contact &amp; location</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className={card}>
          <p className={lbl}>Address</p>
          <p className="mt-2 leading-7 text-[#0B2A47]">{c.address} · <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" className="font-bold text-[#0A7BBF] hover:underline">View on map</a></p>
        </div>
        <div className={card}>
          <p className={lbl}>Phone</p>
          <a href={`tel:${c.phoneHref}`} className="mt-2 block font-bold text-[#0B2A47] hover:text-[#0A7BBF]">{c.phone}</a>
        </div>
        <div className={card}>
          <p className={lbl}>Email</p>
          <a href={`mailto:${c.email}`} className="mt-2 block break-all font-bold text-[#0B2A47] hover:text-[#0A7BBF]">{c.email}</a>
        </div>
        <div className={card}>
          <p className={lbl}>Website</p>
          <p className="mt-2 break-all font-bold text-[#0B2A47]">{c.website}</p>
        </div>
        <div className={card}>
          <p className={lbl}>Academic session</p>
          <p className="mt-2 font-bold text-[#0B2A47]">{c.session}</p>
        </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl border border-[#E1E7EE] bg-[#E1F1FA]">
        <iframe
          title={`Map showing ${name}`}
          src={`https://maps.google.com/maps?q=${q}&z=15&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full border-0"
        />
        <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" className="absolute left-3 top-3 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-[#0A7BBF] shadow-lg hover:bg-[#E1F1FA]">
          Open in Maps ↗
        </a>
      </div>
    </div>
  );
}
