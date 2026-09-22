"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

function Star({ filled, onClick, label }: { filled: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={filled}
      className={`p-1 transition-colors ${
        filled ? "text-amber-600" : "text-neutral-300 hover:text-neutral-400"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-9 w-9 fill-current" aria-hidden="true">
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    </button>
  );
}

export default function ReviewPage() {
  const params = useParams<{ restaurantId: string }>();
  const restaurantId = params.restaurantId;
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ask the backend for the restaurant name, so we know what we are reviewing.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/restaurants/${restaurantId}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) setNotFound(true);
        else setRestaurantName(data.name);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  async function handleSubmit() {
    if (rating === null) return;
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId: Number(restaurantId), rating, comment }),
    });
    const data = await res.json();

    if (!res.ok) {
      // The backend knows what is wrong: show its words, not our own.
      setError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push(`/restaurant/${restaurantId}`);
  }

  if (notFound) {
    return (
      <main className="min-h-screen bg-[#FAF9F7]">
        <div className="mx-auto w-full max-w-[560px] px-6 py-12">
          <h1 className="text-2xl font-semibold text-neutral-900">Restaurant not found</h1>
        </div>
      </main>
    );
  }

  if (!restaurantName) {
    return (
      <main className="min-h-screen bg-[#FAF9F7]">
        <div className="mx-auto w-full max-w-[560px] px-6 py-12">
          <p className="text-neutral-500">Loading…</p>
        </div>
      </main>
    );
  }

  const submitDisabled = rating === null || comment.trim() === "" || submitting;

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <div className="mx-auto w-full max-w-[560px] px-6 py-12">
        <h1 className="text-2xl font-semibold text-neutral-900">{restaurantName}</h1>
        <p className="mt-1 text-sm text-neutral-600">Write a review</p>

        <div className="mt-10">
          <p className="text-sm font-medium text-neutral-700">Your rating</p>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                label={`${n} of 5 stars`}
                filled={rating !== null && n <= rating}
                onClick={() => setRating(n)}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <label htmlFor="comment" className="text-sm font-medium text-neutral-700">
            Your comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="How was it?"
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-600 focus:outline-none"
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitDisabled}
          className="mt-8 w-full rounded-xl bg-neutral-900 px-4 py-3 font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {submitting ? "Submitting…" : "Submit review"}
        </button>
      </div>
    </main>
  );
}