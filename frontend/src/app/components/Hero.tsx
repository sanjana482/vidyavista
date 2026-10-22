"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_PREF,
  readPreference,
  savePreference,
  type SchoolTypeLabel,
} from "../lib/preferences";

const cityList = [
  "Mumbai",
  "Thane",
  "Navi Mumbai",
  "Pune",
  "Nashik",
  "Nagpur",
  "Bengaluru",
  "New Delhi",
  "Jaipur",
  "Ahmedabad",
  "Surat",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Lucknow",
  "Noida",
  "Gurugram",
  "Faridabad",
  "Ghaziabad",
  "Bhopal",
  "Indore",
  "Vadodara",
  "Mysuru",
  "Kochi",
  "Patna",
  "Chandigarh",
];

const stateList = [
  "Maharashtra",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Rajasthan",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Tamil Nadu",
  "Telangana",
  "West Bengal",
  "Haryana",
  "Kerala",
  "Punjab",
  "Bihar",
  "Goa",
  "Andhra Pradesh",
  "Odisha",
  "Assam",
  "Jharkhand",
  "Uttarakhand",
];

const schoolTypes: SchoolTypeLabel[] = [
  "Day Schools",
  "Boarding Schools",
  "Day - Boarding",
];

export default function Hero() {
  const router = useRouter();
  const [schoolType, setSchoolType] = useState<SchoolTypeLabel>(DEFAULT_PREF.type);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Check on load if location is already selected, if not, open modal automatically
  useEffect(() => {
    const saved = readPreference();
    if (saved && saved.location) {
      setSchoolType(saved.type);
      setSelectedLocation(saved.location);
    } else {
      setModalOpen(true);
    }
  }, []);

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalOpen]);

  const isBoarding = schoolType === "Boarding Schools";
  const locationLabel = isBoarding ? "State" : "City";

  const locations = useMemo(() => {
    const list = isBoarding ? stateList : cityList;
    return list.filter((item) =>
      item.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [isBoarding, search]);

  function changeType(type: SchoolTypeLabel) {
    if (type === schoolType) return;
    setSchoolType(type);
    setSearch("");
    setSelectedLocation("");
  }

  function chooseSchoolType(type: SchoolTypeLabel) {
    changeType(type);
    setModalOpen(true);
  }

  function confirmLocation() {
    if (!selectedLocation) return;
    savePreference({ type: schoolType, location: selectedLocation });
    setModalOpen(false);
  }

  function searchSchools() {
    if (!selectedLocation) {
      setModalOpen(true);
      return;
    }

    savePreference({ type: schoolType, location: selectedLocation });

    const params = new URLSearchParams({
      type: schoolType,
      [isBoarding ? "state" : "city"]: selectedLocation,
    });

    router.push(`/schools?${params.toString()}`);
  }

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#DDEAF1] via-[#E6F0F8] to-[#F6DDE5]">
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute -right-24 -top-20 -z-10 h-96 w-96 rounded-full bg-[#FF9DBB]/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 -z-10 h-96 w-96 rounded-full bg-[#56B5EC]/40 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#A1D6F4] bg-white/80 px-4 py-2 text-sm font-bold text-[#0A6AA8] shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-[#EC0E58]" />
            A Brighter Future Begins Here
          </div>

          <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-[#12304A] sm:text-5xl lg:text-6xl">
            Find the School{" "}
            <span className="mt-1 block bg-gradient-to-r from-[#0A6AA8] via-[#0B86C8] to-[#EC0E58] bg-clip-text text-transparent">
              That Feels Right.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-[#4F5B69] sm:text-lg">
            Explore schools, compare facilities and fees, and find a learning
            environment where your child can learn, grow and shine.
          </p>

          <div className="mt-8 rounded-3xl border border-white/90 bg-gradient-to-br from-white via-[#F9FBFD] to-[#E5EEF4] p-5 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold text-[#12304A]">
                Find your ideal school
              </h2>
              <span className="rounded-full bg-[#DDE4EC] px-3 py-1 text-xs font-bold text-[#3E5773]">
                Start here
              </span>
            </div>

            <p className="mt-2 text-sm text-[#687789]">
              Select a school type to get started.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {schoolTypes.map((type, index) => {
                const active = schoolType === type;
                const accent = [
                  "border-[#0A7BBF] bg-[#DDEAF2] text-[#0A5C91]",
                  "border-[#EC0E58] bg-[#FAE5EC] text-[#B30E49]",
                  "border-[#6E8BAD] bg-[#E5EAF0] text-[#39506B]",
                ][index];

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => chooseSchoolType(type)}
                    className={`rounded-xl border px-3 py-3 text-sm font-bold transition hover:-translate-y-0.5 ${
                      active
                        ? `${accent} shadow-sm`
                        : "border-[#DDE2E8] bg-white text-[#4E5A68] hover:border-[#A8B8CB]"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setModalOpen(true);
              }}
              className="mt-5 flex w-full items-center gap-3 rounded-xl border border-[#C9D3DF] bg-white px-4 py-4 text-left transition hover:border-[#0A7BBF] hover:bg-[#F5F9FB]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DDEAF2] text-xl text-[#0A6AA8]">
                ⌖
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-[#687789]">
                  Select {locationLabel}
                </span>
                <span className="mt-1 block truncate font-bold text-[#12304A]">
                  {selectedLocation || `Choose your ${locationLabel.toLowerCase()}`}
                </span>
              </span>
              <span className="text-sm font-bold text-[#0A7BBF]">Change</span>
            </button>

            <button
              type="button"
              onClick={searchSchools}
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#0A5C91] via-[#0A7BBF] to-[#5C799A] px-5 py-4 font-extrabold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              Search Schools
            </button>
          </div>
        </div>

        {/* Right side banner */}
        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=85"
              alt="School campus"
              className="h-[350px] w-full object-cover sm:h-[470px]"
            />
          </div>
        </div>
      </div>

      {/* Mandatory Location Selector Modal with High Z-Index & Scroll Lock */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div
            role="dialog"
            aria-modal="true"
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-5 sm:p-6">
              <div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                  VIDYAVISTA LOCATION FINDER
                </span>
                <h2 className="mt-2 text-xl font-extrabold text-gray-900 sm:text-2xl">
                  Where are you looking for schools?
                </h2>
                <p className="text-sm text-gray-600">
                  Please select your location first to continue browsing.
                </p>
              </div>
              {/* Close button only enabled if location is already selected */}
              {selectedLocation && (
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl bg-gray-200 px-3 py-1.5 text-lg font-bold text-gray-700 hover:bg-gray-300"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="grid gap-4 border-b border-gray-200 p-5 lg:grid-cols-[1fr_290px] sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                {schoolTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => changeType(type)}
                    className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                      schoolType === type
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search ${locationLabel.toLowerCase()}...`}
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-600"
              />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
              <h3 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-gray-500">
                {isBoarding ? "Select a state" : "Popular cities"} ({locations.length})
              </h3>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {locations.map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => setSelectedLocation(location)}
                    className={`flex min-h-12 items-center justify-between rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${
                      selectedLocation === location
                        ? "border-blue-600 bg-blue-100 text-blue-900 shadow-sm"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-400"
                    }`}
                  >
                    <span>{location}</span>
                    {selectedLocation === location && (
                      <span className="font-extrabold text-blue-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 p-5 sm:px-6">
              <p className="text-sm font-medium text-gray-700">
                {selectedLocation
                  ? `Selected: ${selectedLocation}`
                  : "Location selection is required to proceed."}
              </p>
              <button
                type="button"
                disabled={!selectedLocation}
                onClick={confirmLocation}
                className="rounded-xl bg-blue-600 px-6 py-3 font-extrabold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}