
"use client";

import { useRouter } from "next/navigation";
import { savePreference } from "../lib/preferences";

const cities = [
  {
    name: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Bengaluru",
    image:
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Pune",
    image:
      "https://images.unsplash.com/photo-1567157577867-8d16e90f1571?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dehradun",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Jaipur",
    image:
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=600&q=80",
  },
];

const states = [
  {
    name: "Maharashtra",
    image:
      "https://images.unsplash.com/photo-1567157577867-8d16e90f1571?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Karnataka",
    image:
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Delhi",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Tamil Nadu",
    image:
      "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Gujarat",
    image:
      "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Rajasthan",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80",
  },
];

type LocationCardProps = {
  name: string;
  image: string;
  onClick: () => void;
};

function LocationCard({ name, image, onClick }: LocationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative h-48 overflow-hidden rounded-3xl border-4 border-white bg-[#DDEAF2] text-left shadow-md shadow-[#12304A]/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:h-52"
    >
      <img
        src={image}
        alt={`${name} city`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#172B32]/90 via-[#172B32]/15 to-transparent" />

      <span className="absolute bottom-4 left-4 right-14 text-lg font-extrabold text-white sm:text-xl">
        {name}
      </span>

      <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F8FB] text-lg font-bold text-[#0A5C91] transition group-hover:bg-[#FF9DBB]">
        ↗
      </span>
    </button>
  );
}

export default function PopularLocations() {
  const router = useRouter();

  return (
    <section className="overflow-hidden bg-gradient-to-b from-[#FAFCFD] via-[#F0F5F8] to-[#EEF5FA] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl space-y-20 px-5 lg:px-8">
        
        {/* Popular States */}
        <div>
          <div className="mb-8">
            <span className="inline-flex rounded-full bg-[#FAE5EC] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#C8104F]">
              Explore by state
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#12304A] sm:text-4xl">
              Top States for Boarding Schools
            </h2>

            <p className="mt-3 text-base leading-7 text-[#5C6A7B]">
              Explore boarding schools in popular education destinations across India.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {states.map((state) => (
              <LocationCard
                key={state.name}
                name={state.name}
                image={state.image}
                onClick={() => {
                  savePreference({ type: "Boarding Schools", location: state.name });
                  router.push(
                    `/schools?type=${encodeURIComponent("Boarding Schools")}&state=${encodeURIComponent(state.name)}`
                  );
                }}
              />
            ))}
          </div>
        </div>
        {/* Popular Cities */}
        <div>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex rounded-full bg-[#DDEAF2] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#0A5C91]">
                Explore by city
              </span>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#12304A] sm:text-4xl">
                Popular Cities for Day Schools
              </h2>

              <p className="mt-3 text-base leading-7 text-[#5C6A7B]">
                Discover day schools across India's leading education destinations.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {cities.map((city) => (
              <LocationCard
                key={city.name}
                name={city.name}
                image={city.image}
                onClick={() => {
                  savePreference({ type: "Day Schools", location: city.name });
                  router.push(
                    `/schools?type=${encodeURIComponent("Day Schools")}&city=${encodeURIComponent(city.name)}`
                  );
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
