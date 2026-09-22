import Link from "next/link";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#FAF9F7] font-sans">
      <div className="text-center">
        <p className="text-3xl font-semibold text-neutral-900">zomato-lite is alive</p>
        <Link
          href="/restaurant/1"
          className="mt-6 inline-block rounded-xl border border-neutral-200 bg-white px-5 py-3 text-neutral-900 transition-colors hover:border-neutral-900"
        >
          View Bombay Sandwich Co.
        </Link>
      </div>
    </main>
  );
}