"use client";

import { useState } from "react";
import { lakh, rupee, type FeeSlab } from "../../data/profile";
import { openEnquiry } from "./enquiry";

type Props = {
  schoolName: string;
  slabs: Record<"2027-28" | "2026-27", FeeSlab[]>;
  updated: string;
  source: string;
};

const FREQ_STYLE: Record<string, string> = {
  "One-time": "bg-[#FDE8EF] text-[#C8104F]",
  Monthly: "bg-[#E4E9F0] text-[#344251]",
  Annually: "bg-[#E1F1FA] text-[#0A5C91]",
};

export default function FeeSection({ schoolName, slabs, updated, source }: Props) {
  const [session, setSession] = useState<"2027-28" | "2026-27">("2027-28");
  const [open, setOpen] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const list = slabs[session];
  const annuals = list.map((x) => x.annual);
  const min = Math.min(...annuals);
  const max = Math.max(...annuals);
  const first = list[0];
  const last = list[list.length - 1];
  const hi = list.find((x) => x.annual === max)!;
  const pct = Math.round((last.annual / first.annual - 1) * 100);
  const visible = showAll ? list : list.slice(0, 5);
  const hidden = list.length - 5;

  function downloadCsv() {
    const rows = [["Class", "Stage", "Monthly fee (INR)", "Annual fee (INR)", "Session"]];
    list.forEach((x) => rows.push([x.cls, x.stage, String(x.monthly), String(x.annual), session]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${schoolName.replace(/\W+/g, "-").toLowerCase()}-fees-${session}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0B2A47]">Fee structure of {schoolName}</h2>
          <p className="mt-2 text-[#5C6A7B]">Class-wise fees with a full component breakdown for every class.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-[#E9EEF4] p-1" role="tablist" aria-label="Session">
            {(["2027-28", "2026-27"] as const).map((y) => (
              <button
                key={y}
                role="tab"
                aria-selected={session === y}
                onClick={() => { setSession(y); setOpen(null); }}
                className={`rounded-lg px-4 py-2.5 text-sm font-extrabold transition ${session === y ? "bg-[#0B2A47] text-white shadow" : "text-[#5C6A7B] hover:text-[#0B2A47]"}`}
              >
                {y}
              </button>
            ))}
          </div>
          <button type="button" onClick={downloadCsv} className="rounded-xl border border-[#D6DDE5] bg-white px-4 py-3 text-sm font-bold text-[#0B2A47] transition hover:border-[#0795DC] hover:text-[#0A7BBF]">
            ⬇ Download CSV
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#0B2A47] to-[#0A5C91] p-5 text-white shadow-lg shadow-[#0A5C91]/20">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-white/75">Starting from</p>
          <p className="mt-2 text-2xl font-extrabold">{rupee(min)}</p>
          <p className="mt-1 text-xs text-white/75">per year · {first.cls}</p>
        </div>
        <div className="rounded-2xl border border-[#E1E7EE] bg-[#F6FAFD] p-5">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#5C6A7B]">Highest</p>
          <p className="mt-2 text-2xl font-extrabold text-[#0B2A47]">{rupee(max)}</p>
          <p className="mt-1 text-xs text-[#707E8F]">per year · {hi.cls}</p>
        </div>
        <div className="rounded-2xl border border-[#E1E7EE] bg-[#F6FAFD] p-5">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#5C6A7B]">Classes covered</p>
          <p className="mt-2 text-xl font-extrabold text-[#0B2A47]">{first.cls} – {last.cls}</p>
          <p className="mt-1 text-xs text-[#707E8F]">{list.length} fee slabs</p>
        </div>
        <div className="rounded-2xl border border-[#E1E7EE] bg-[#F6FAFD] p-5">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#5C6A7B]">Last updated</p>
          <p className="mt-2 text-xl font-extrabold text-[#0B2A47]">{updated}</p>
          <p className="mt-1 text-xs text-[#707E8F]">Public listing</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-[#4E5A68]">
        📈 Fees step up as children move to higher classes: {last.cls} costs about {pct}% more than {first.cls} ({session} listing).
      </p>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[#E1E7EE]">
        <div className="hidden grid-cols-[1.3fr_1fr_1fr_auto] gap-4 bg-gradient-to-r from-[#E1F1FA] to-[#FDE8EF] px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-[#0B2A47] sm:grid">
          <span>Class</span><span>Monthly fee</span><span>Annual fee</span><span className="w-36" />
        </div>

        {visible.map((x) => {
          const isOpen = open === x.cls;
          return (
            <div key={x.cls} className="border-t border-[#E1E7EE] first:border-t-0">
              <div className="grid grid-cols-2 items-center gap-4 px-6 py-4 sm:grid-cols-[1.3fr_1fr_1fr_auto]">
                <div>
                  <p className="font-extrabold text-[#0B2A47]">{x.cls}</p>
                  <p className="text-sm text-[#707E8F]">{x.stage}</p>
                </div>
                <div>
                  <p className="font-extrabold text-[#0B2A47]">{rupee(x.monthly)}</p>
                  <p className="text-xs text-[#8896A6]">/ month</p>
                </div>
                <div>
                  <p className="font-extrabold text-[#0B2A47]">{rupee(x.annual)}</p>
                  <p className="text-xs text-[#8896A6]">/ year</p>
                </div>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : x.cls)}
                  className={`w-36 rounded-full border px-4 py-2.5 text-sm font-bold transition ${isOpen ? "border-[#0B2A47] bg-[#0B2A47] text-white" : "border-[#D6DDE5] bg-white text-[#0B2A47] hover:border-[#0795DC] hover:text-[#0A7BBF]"}`}
                >
                  {isOpen ? "View less ˄" : "View breakdown ˅"}
                </button>
              </div>

              {isOpen && (
                <div className="bg-[#F6FAFD] px-4 pb-6 pt-2 sm:px-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-[#0B2A47]">Fee breakdown: {x.cls}</h3>
                      <p className="text-sm text-[#707E8F]">{session} session</p>
                    </div>
                    <span className="rounded-full bg-[#FDE8EF] px-3 py-1.5 text-xs font-extrabold text-[#C8104F]">Sample split · for reference</span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-[#E1E7EE] bg-white p-4">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#5C6A7B]">Pay at admission (one-time)</p>
                      <p className="mt-2 text-xl font-extrabold text-[#0B2A47]">{rupee(x.oneTime)}</p>
                    </div>
                    <div className="rounded-2xl border border-[#E1E7EE] bg-white p-4">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#5C6A7B]">Recurring through the year</p>
                      <p className="mt-2 text-xl font-extrabold text-[#0B2A47]">{rupee(x.recurring)}</p>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-[#0B2A47] to-[#0A5C91] p-4 text-white">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-white/75">Total annual fee</p>
                      <p className="mt-2 text-xl font-extrabold">{rupee(x.annual)}</p>
                    </div>
                  </div>

                  <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E1E7EE] bg-white">
                    <table className="w-full min-w-[480px] text-left text-sm">
                      <thead className="bg-gradient-to-r from-[#E1F1FA] to-[#FDE8EF] text-[#0B2A47]">
                        <tr><th className="px-4 py-3">Fee component</th><th className="px-4 py-3">Frequency</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Per year</th></tr>
                      </thead>
                      <tbody className="divide-y divide-[#E1E7EE] text-[#4E5A68]">
                        {x.rows.map((r) => (
                          <tr key={r.label}>
                            <td className="px-4 py-3.5">{r.label}</td>
                            <td className="px-4 py-3.5"><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${FREQ_STYLE[r.freq]}`}>{r.freq}</span></td>
                            <td className="px-4 py-3.5">{rupee(r.amount)}</td>
                            <td className="px-4 py-3.5">{rupee(r.perYear)}</td>
                          </tr>
                        ))}
                        <tr className="bg-[#F1F8FC] font-extrabold text-[#0B2A47]">
                          <td className="px-4 py-3.5" colSpan={3}>Total estimated annual fee</td>
                          <td className="px-4 py-3.5">{rupee(x.annual)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-3 text-sm text-[#707E8F]">
                    This split is illustrative and not the school&apos;s official fee letter. One-time charges may apply only to new admissions. Please confirm the exact components with the school.
                  </p>
                  <button type="button" onClick={() => openEnquiry(x.cls)} className="mt-4 rounded-xl bg-[#EC0E58] px-5 py-3 text-sm font-extrabold text-white shadow-md shadow-[#EC0E58]/25 transition hover:bg-[#C8104F]">
                    Enquire for {x.cls}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {hidden > 0 && (
          <div className="border-t border-[#E1E7EE] bg-[#F6FAFD] py-4 text-center">
            <button type="button" onClick={() => setShowAll(!showAll)} className="rounded-full border border-[#D6DDE5] bg-white px-6 py-2.5 text-sm font-bold text-[#0B2A47] transition hover:border-[#0795DC] hover:text-[#0A7BBF]">
              {showAll ? "Show fewer classes ˄" : `View ${hidden} more classes ˅`}
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-[#F7B6CB] bg-[#FDF0F5] px-5 py-4 text-[#4E3A44]">
        💡 <strong className="font-extrabold text-[#C8104F]">Good to know:</strong> ask the school whether transport, uniform, books, meals and activities are included in these figures or charged separately, and request the official fee letter before you pay.
      </div>
      <p className="mt-4 text-sm leading-6 text-[#707E8F]">{source}</p>
    </div>
  );
}
