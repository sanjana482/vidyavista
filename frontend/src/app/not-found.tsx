import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="text-sm font-extrabold uppercase tracking-widest text-[#EC0E58]">404</p>
        <h1 className="mt-3 text-4xl font-extrabold text-[#0B2A47]">We couldn&apos;t find that page</h1>
        <p className="mt-4 text-[#5C6A7B]">The school or page you are looking for may have moved. Try browsing all schools.</p>
        <Link href="/schools" className="mt-8 inline-block rounded-xl bg-[#0A5C91] px-7 py-3.5 font-extrabold text-white">
          Browse schools
        </Link>
      </section>
      <Footer />
    </main>
  );
}
