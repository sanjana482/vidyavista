
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const links = [
    { name: "Home", href: "/" },
    { name: "Schools", href: "/schools" },
    { name: "Compare", href: "/compare" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#D6DDE5] bg-white/95 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="VidyaVista home">
          <img
            src="/logo.png"
            alt="VidyaVista - Discover | Learn | Grow"
            className="h-11 w-auto object-contain sm:h-12"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`border-b-2 pb-1 text-sm font-semibold transition hover:text-[#0A7BBF] ${isActive(link.href) ? "border-[#EC0E58] text-[#0B2A47]" : "border-transparent text-[#4E5A68]"}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl px-4 py-3 font-semibold text-[#0A5C91] transition hover:bg-[#E5EDF2]"
          >
            Login
          </Link>
          <Link
            href="/counselling"
            className="rounded-xl bg-gradient-to-r from-[#0A5C91] to-[#0795DC] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#0A5C91]/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Get Counselling
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl border border-[#D6DDE5] bg-white p-2.5 text-xl text-[#0A5C91] md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="space-y-3 border-t border-[#D6DDE5] bg-white px-5 py-5 md:hidden">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 font-semibold text-[#4E5A68] hover:bg-[#E5EDF2] hover:text-[#0A5C91]"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2 font-semibold text-[#0A5C91]"
          >
            Login
          </Link>
          <Link
            href="/counselling"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl bg-[#0A5C91] px-5 py-3 text-center font-bold text-white"
          >
            Get Counselling
          </Link>
        </div>
      )}
    </header>
  );
}
