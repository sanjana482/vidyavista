import Link from "next/link";

const types = [
  { icon: "🏠", title: "Day School", text: "Students attend classes and return home every day. Best when you want your child close to family and a shorter school-hours routine." },
  { icon: "🏫", title: "Boarding School", text: "A fully residential campus with study hours, sports and activities built into the day. Good for independence and a structured routine." },
  { icon: "🔄", title: "Day + Boarding", text: "Offers both options on one campus, so families can choose day scholar or hostel stay depending on the child's comfort and age." },
];

const boards = [
  ["CBSE", "National curriculum, structured syllabus, wide availability across India", "You may relocate between cities or are aiming for national entrance exams"],
  ["ICSE / ISC", "Strong English and language focus with detailed coursework", "You want broad subject depth and strong writing and communication skills"],
  ["IB", "Inquiry-based, project and research driven, globally recognised", "You are considering studying abroad or prefer a global approach"],
  ["Cambridge (IGCSE)", "Flexible subject choices and international pathways", "You want subject flexibility with an international qualification"],
  ["State Board", "Aligned with the state framework and regional language", "You prefer local-language instruction and state-level admissions"],
];

const boardLinks = [
  ["CBSE schools", "CBSE"], ["ICSE schools", "ICSE"], ["IB schools", "IB"],
  ["Cambridge schools", "Cambridge"], ["State Board schools", "State Board"],
];

const steps = [
  ["Set your priorities.", "Decide your budget range, preferred board, school type and the maximum travel time you are comfortable with."],
  ["Filter and shortlist.", "Use the filters on this page to narrow the list to three to five schools that match your priorities."],
  ["Read parent reviews.", "Look for patterns in feedback about teaching quality, safety, communication and pastoral care."],
  ["Visit the campus.", "Meet the admissions team, see the facilities and observe how students and teachers interact."],
  ["Apply early.", "Note application dates, entrance tests and document requirements, and submit well before the deadline."],
];

const checks = [
  "Classroom size and teaching style", "Science labs, library and computer facilities",
  "Sports grounds and arts spaces", "Safety, CCTV and visitor policies",
  "Transport routes and timings", "Hostel, dining and medical care (for boarding)",
  "Counselling and student support", "Communication with parents",
];

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="border-l-4 border-[#EC0E58] pl-4 text-2xl font-extrabold text-[#0B2A47]">{children}</h2>;
}

export default function ParentGuide() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0795DC]">Parent&apos;s guide</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B2A47] sm:text-4xl">
          How to Choose the Right School in India (2027-28)
        </h2>
        <p className="mt-4 max-w-4xl leading-7 text-[#626F7D]">
          Every family looks for something different: a strong academic record, a caring environment, sports and arts, or a board that fits long-term plans. With so many options across Mumbai, Delhi, Bengaluru, Pune, Hyderabad and Chennai, a clear process saves time and avoids last-minute stress. This guide explains school types, boards, fees and what to check before you apply.
        </p>

        <div className="mt-10"><H>Types of schools: day, boarding and day + boarding</H></div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {types.map((t) => (
            <div key={t.title} className="rounded-2xl border border-[#E1E7EE] bg-[#F6FAFD] p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">{t.icon}</span>
              <h3 className="mt-4 font-extrabold text-[#0B2A47]">{t.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#626F7D]">{t.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12"><H>Which board should you pick?</H></div>
        <p className="mt-4 text-[#626F7D]">
          Your choice of board shapes the teaching style, the exams your child will take and the pathways open after Class 12. Here is a quick comparison.
        </p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-[#E1E7EE]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-gradient-to-r from-[#E1F1FA] to-[#FDE8EF] text-xs font-extrabold uppercase tracking-wider text-[#0B2A47]">
              <tr><th className="px-5 py-4">Board</th><th className="px-5 py-4">Known for</th><th className="px-5 py-4">A good fit if</th></tr>
            </thead>
            <tbody className="divide-y divide-[#E1E7EE] text-[#626F7D]">
              {boards.map(([b, k, g]) => (
                <tr key={b}><td className="px-5 py-4 font-extrabold text-[#0B2A47]">{b}</td><td className="px-5 py-4">{k}</td><td className="px-5 py-4">{g}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {boardLinks.map(([label, b]) => (
            <Link key={b} href={`/schools?board=${encodeURIComponent(b)}`} scroll={false}
              className="rounded-full border border-[#D6DDE5] px-4 py-2.5 text-xs font-extrabold text-[#0A5C91] transition hover:border-[#0795DC] hover:bg-[#E1F1FA]">
              {label} →
            </Link>
          ))}
        </div>

        <div className="mt-12"><H>A simple 5-step way to shortlist schools</H></div>
        <ol className="mt-5 space-y-3">
          {steps.map(([b, t], i) => (
            <li key={b} className="flex items-center gap-4 rounded-2xl border border-[#E1E7EE] px-5 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0A5C91] to-[#0795DC] text-sm font-extrabold text-white">{i + 1}</span>
              <p className="text-[#626F7D]"><strong className="font-extrabold text-[#0B2A47]">{b}</strong> {t}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12"><H>Understanding school fees</H></div>
        <p className="mt-4 max-w-4xl leading-7 text-[#626F7D]">
          Annual fees depend on the city, board, facilities and whether the school is a day or boarding school. International boards and residential campuses generally cost more than day schools following national or state boards. When you compare, look beyond tuition: ask about admission and development charges, transport, uniform, books, activities and hostel or meal fees so you can plan the full yearly cost.
        </p>

        <div className="mt-12"><H>What to check during a campus visit</H></div>
        <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {checks.map((c) => (
            <li key={c} className="flex gap-3 text-[#626F7D]"><span className="font-extrabold text-[#0795DC]">✓</span>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
