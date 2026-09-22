"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

type Restaurant = {
  name: string;
  cuisine: string;
  area: string;
  photoUrl: string | null;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

// Colour chosen for a rating: 5 = dark green ... 1 = red.
// A lookup table, not a calculation.
const strongColors: Record<number, string> = {
  5: "bg-green-700",
  4: "bg-green-600",
  3: "bg-amber-500",
  2: "bg-orange-600",
  1: "bg-red-700",
};

const softColors: Record<number, string> = {
  5: "bg-green-50",
  4: "bg-green-50",
  3: "bg-amber-50",
  2: "bg-orange-50",
  1: "bg-red-50",
};

// The average bubble colour follows the same scale, by comparison (no arithmetic).
function bubbleColor(average: number | null): string {
  if (average === null) return "bg-neutral-400";
  if (average >= 4.5) return "bg-green-700";
  if (average >= 4) return "bg-green-600";
  if (average >= 3) return "bg-amber-500";
  if (average >= 2) return "bg-orange-600";
  return "bg-red-700";
}

export default function RestaurantPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [data, setData] = useState<Restaurant | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Ask the backend for everything this page shows. We render exactly what it returns.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/restaurants/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled) return;
        if (json && json.name) setData(json);
        else setNotFound(true);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (notFound) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto w-full max-w-[560px] px-6 py-12">
          <h1 className="text-2xl font-semibold text-neutral-900">Restaurant not found</h1>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto w-full max-w-[560px] px-6 py-12">
          <p className="text-neutral-500">Loading…</p>
        </div>
      </main>
    );
  }

  const hasReviews = data.totalReviews > 0;
  const latest = data.latestReview;
  const older = data.reviews;
  // The backend owns each restaurant's photo. If it sent none, fall back to
  // the default sandwich photo (that's what Bombay Sandwich Co. keeps).
  const heroImage =
    data.photoUrl ??
    "https://images.unsplash.com/photo-1655279562015-047c3da9a271?w=1200&q=80&auto=format&fit=crop";

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[560px] px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-[#E23744] hover:text-[#E23744]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M12 3l9 7h-2v10h-5v-6h-4v6H5V10H3z" />
          </svg>
          Home
        </Link>

        <div className="relative mt-4 h-56 w-full overflow-hidden rounded-2xl">
          <Image
            src={heroImage}
            alt={`${data.name}`}
            fill
            priority
            sizes="(max-width: 560px) 100vw, 560px"
            className="object-cover"
          />
        </div>

        <div className="mt-6 border-b border-neutral-100 pb-6">
          <h1 className="text-3xl font-semibold text-neutral-900">{data.name}</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {data.cuisine} · {data.area}
          </p>
        </div>

        {hasReviews ? (
          <>
            <section className="mt-6 flex items-center gap-4">
              <div className={`rounded-2xl px-4 py-3 text-white ${bubbleColor(data.averageRating)}`}>
                {/* The average, printed exactly as the backend sent it: no calculation here. */}
                <p className="text-5xl font-semibold leading-none">{data.averageRating}</p>
              </div>
              <p className="text-sm text-neutral-600">
                {data.totalReviews} {data.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </section>

            {latest && (
              <section className={`mt-8 rounded-2xl p-5 text-white ${strongColors[latest.rating]}`}>
                <p className="text-xs font-medium uppercase tracking-wide text-white/80">
                  Latest review
                </p>
                <p className="mt-2 text-sm text-white/90">{latest.rating}/5</p>
                <p className="mt-1">{latest.comment}</p>
              </section>
            )}

            {older.length > 0 && (
              <ul className="mt-6 space-y-4">
                {older.map((r) => (
                  <li key={r.id} className={`rounded-2xl p-5 ${softColors[r.rating]}`}>
                    <p className="text-sm text-neutral-600">{r.rating}/5</p>
                    <p className="mt-1 text-neutral-900">{r.comment}</p>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href={`/review/${id}`}
              className="mt-10 inline-block w-full rounded-xl bg-[#E23744] px-5 py-3 text-center font-medium text-white transition-colors hover:bg-[#c92a36]"
            >
              Write a review
            </Link>
          </>
        ) : (
          <section className="mt-10 rounded-2xl border border-neutral-200 p-8 text-center">
            <p className="text-lg font-medium text-neutral-900">No reviews yet.</p>
            <p className="mt-1 text-sm text-neutral-600">Be the first to review this place.</p>
            <Link
              href={`/review/${id}`}
              className="mt-5 inline-block rounded-xl bg-[#E23744] px-5 py-3 font-medium text-white transition-colors hover:bg-[#c92a36]"
            >
              Write the first review
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}