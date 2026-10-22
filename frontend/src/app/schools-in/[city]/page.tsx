import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { citiesOf, formatFee, stateFor } from "../../data/schools";
import { fetchAllSchools, fetchAllSchoolsSafe } from "../../lib/schoolsApi";
import { abs, cityPath, jsonLd, schoolPath, slugify } from "../../lib/seo";

type Props = { params: { city: string } };

export const revalidate = 60;

const findCity = (slug: string, cities: string[]) => cities.find((c) => slugify(c) === slug);

export async function generateStaticParams() {
  return citiesOf(await fetchAllSchoolsSafe()).map((c) => ({ city: slugify(c) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const schools = await fetchAllSchools();
  const city = findCity(params.city, citiesOf(schools));
  if (!city) return { title: "Page not found", robots: { index: false } };
  const list = schools.filter((s) => s.city === city);
  const title = `Best Schools in ${city} 2027-28 – Fees, Boards & Reviews`;
  const description = `Compare ${list.length} top schools in ${city}, ${stateFor(list[0])}: CBSE, ICSE, IB and more. Check fees, facilities, admission and parent reviews on VidyaVista.`;
  return {
    title,
    description,
    alternates: { canonical: cityPath(city) },
    openGraph: { title, description, url: cityPath(city), type: "website" },
  };
}

export default async function CityPage({ params }: Props) {
  const schools = await fetchAllSchools();
  const CITIES = citiesOf(schools);
  const city = findCity(params.city, CITIES);
  if (!city) notFound();
  const list = schools.filter((s) => s.city === city);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Best Schools in ${city}`,
      numberOfItems: list.length,
      itemListElement: list.map((s, i) => ({ "@type": "ListItem", position: i + 1, url: abs(schoolPath(s)), name: s.name })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
        { "@type": "ListItem", position: 2, name: "Schools", item: abs("/schools") },
        { "@type": "ListItem", position: 3, name: city, item: abs(cityPath(city)) },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Navbar />
      <section className="bg-gradient-to-br from-[#E6F4FC] via-white to-[#FDE8EF]">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-[#5C6A7B]">
            <Link href="/" className="hover:text-[#0A7BBF]">Home</Link><span className="mx-2">›</span>
            <Link href="/schools" className="hover:text-[#0A7BBF]">Schools</Link><span className="mx-2">›</span>
            <span className="text-[#0B2A47]">{city}</span>
          </nav>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#0B2A47] sm:text-5xl">
            Best Schools in {city} <span className="text-[#0795DC]">2027-28</span>
          </h1>
          <p className="mt-4 max-w-3xl text-[#4E5A68]">
            Explore {list.length} {list.length === 1 ? "school" : "schools"} in {city}, {stateFor(list[0])}. Compare boards, annual fees,
            facilities and parent reviews, then shortlist and enquire directly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <li key={s.id}>
              <Link href={schoolPath(s)} className="group block overflow-hidden rounded-2xl border border-[#E1E7EE] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="aspect-[16/8] overflow-hidden bg-[#E1F1FA]">
                  <img src={s.image} alt={`${s.name} campus, ${s.area}`} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-extrabold text-[#0B2A47] group-hover:text-[#0A7BBF]">{s.name}</h2>
                  <p className="mt-1 text-sm text-[#707E8F]">{s.area}, {city} · {s.board} · {s.type}</p>
                  <p className="mt-3 text-sm font-extrabold text-[#EC0E58]">from {formatFee(s.fee)} / year</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <h2 className="text-lg font-extrabold text-[#0B2A47]">Other cities</h2>
          <ul className="mt-3 flex flex-wrap gap-3">
            {CITIES.filter((c) => c !== city).map((c) => (
              <li key={c}><Link href={cityPath(c)} className="rounded-full border border-[#D6DDE5] px-4 py-2 text-sm font-semibold text-[#0A5C91] hover:border-[#0795DC]">Schools in {c}</Link></li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </main>
  );
}
