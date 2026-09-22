"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Restaurant = {
  id: number;
  name: string;
  cuisine: string;
  area: string;
  photoUrl: string | null;
};

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
  const [error, setError] = useState(false);

  // Ask the backend for the menu of restaurants. We render exactly what it returns.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/restaurants")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled) return;
        if (json && Array.isArray(json.restaurants)) setRestaurants(json.restaurants);
        else setError(true);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <div className="mx-auto w-full max-w-[560px] px-6 py-10">
        <header className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#E23744] text-2xl font-bold text-white">
            Z
          </span>
          <h1 className="text-3xl font-bold text-[#E23744]">Zomato lite</h1>
        </header>
        <p className="mt-1 text-sm text-neutral-600">Restaurants near you</p>

        {error ? (
          <p className="mt-8 text-neutral-600">Couldn&apos;t load restaurants. Please try again.</p>
        ) : !restaurants ? (
          <p className="mt-8 text-neutral-500">Loading…</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {restaurants.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/restaurant/${r.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 transition-colors hover:border-[#E23744]"
                >
                  {r.photoUrl ? (
                    <Image
                      src={r.photoUrl}
                      alt={r.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="h-16 w-16 shrink-0 rounded-xl bg-neutral-200"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-semibold text-neutral-900">{r.name}</p>
                    <p className="mt-0.5 truncate text-sm text-neutral-600">
                      {r.cuisine} · {r.area}
                    </p>
                  </div>
                  <span className="text-2xl text-[#E23744]" aria-hidden="true">
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}