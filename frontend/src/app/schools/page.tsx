import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "../components/Navbar";
import SchoolsHero from "../components/SchoolsHero";
import SchoolListing from "../components/SchoolListing";
import ParentGuide from "../components/ParentGuide";
import SchoolsFAQ from "../components/SchoolsFAQ";
import Footer from "../components/Footer";
import Link from "next/link";
import { citiesOf, type School } from "../data/schools";
import { fetchAllSchools } from "../lib/schoolsApi";
import { listingFaqs } from "../data/faqs";
import { abs, cityPath, jsonLd, schoolPath } from "../lib/seo";

export const metadata: Metadata = {
  title: "Best Schools in India 2027-28",
  description:
    "Compare CBSE, ICSE, IB, Cambridge and State Board schools across major Indian cities by fees, facilities and parent reviews on VidyaVista.",
  // filters (?city=, ?type=) are all the same page for Google -> one canonical URL
  alternates: { canonical: "/schools" },
  openGraph: {
    title: "Best Schools in India 2027-28",
    description: "Compare fees, boards, facilities and parent reviews of day and boarding schools across India.",
    url: "/schools",
    type: "website",
  },
};

// re-built every minute so schools added in /admin show up without a redeploy
export const revalidate = 60;

const listingSchema = (schools: School[]) => [
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best Schools in India 2027-28",
    numberOfItems: schools.length,
    itemListElement: schools.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(schoolPath(s)),
      name: s.name,
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
      { "@type": "ListItem", position: 2, name: "Schools", item: abs("/schools") },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: listingFaqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
];

export default async function Schools() {
  const schools = await fetchAllSchools();
  const CITIES = citiesOf(schools);
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(listingSchema(schools)) }} />
      <Navbar />
      <Suspense fallback={null}>
        <SchoolsHero schools={schools} />
        <SchoolListing schools={schools} />
      </Suspense>

      
      <ParentGuide />
      <SchoolsFAQ />
      <Footer />
    </main>
  );
}
