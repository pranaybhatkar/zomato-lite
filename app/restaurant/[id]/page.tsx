"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

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
      <main className="min-h-screen bg-[#FAF9F7]">
        <div className="mx-auto w-full max-w-[560px] px-6 py-12">
          <h1 className="text-2xl font-semibold text-neutral-900">Restaurant not found</h1>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#FAF9F7]">
        <div className="mx-auto w-full max-w-[560px] px-6 py-12">
          <p className="text-neutral-500">Loading…</p>
        </div>
      </main>
    );
  }

  const hasReviews = data.totalReviews > 0;
  const latest = data.latestReview;
  const older = data.reviews;

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <div className="mx-auto w-full max-w-[560px] px-6 py-12">
        <h1 className="text-3xl font-semibold text-neutral-900">{data.name}</h1>
        <p className="mt-1 text-sm text-neutral-600">
          {data.cuisine} · {data.area}
        </p>

        {hasReviews ? (
          <>
            <section className="mt-10 flex items-baseline gap-3">
              {/* The average, printed exactly as the backend sent it: no calculation here. */}
              <p className="text-7xl font-semibold leading-none text-neutral-900">
                {data.averageRating}
              </p>
              <p className="text-sm text-neutral-600">
                {data.totalReviews} {data.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </section>

            {latest && (
              <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
                  Latest review
                </p>
                <p className="mt-2 text-sm text-neutral-600">{latest.rating}/5</p>
                <p className="mt-1 text-neutral-900">{latest.comment}</p>
              </section>
            )}

            {older.length > 0 && (
              <ul className="mt-8 space-y-6">
                {older.map((r) => (
                  <li key={r.id}>
                    <p className="text-sm text-neutral-600">{r.rating}/5</p>
                    <p className="mt-1 text-neutral-900">{r.comment}</p>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href={`/review/${id}`}
              className="mt-12 inline-block rounded-xl bg-neutral-900 px-5 py-3 font-medium text-white transition-colors hover:bg-neutral-700"
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
              className="mt-5 inline-block rounded-xl bg-neutral-900 px-5 py-3 font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Write the first review
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}