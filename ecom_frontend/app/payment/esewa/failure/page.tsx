"use client";

import Link from "next/link";

export default function EsewaFailurePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 text-white">
      <div className="absolute inset-0">
        <div className="absolute left-[-90px] top-[-70px] h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute right-[-90px] top-[15%] h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-110px] left-[35%] h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />

        <div className="relative">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10">
            <svg
              className="h-12 w-12 text-red-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-red-300/80">
            eSewa Payment
          </p>

          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            Payment Failed
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70 md:text-base">
            Your eSewa payment was canceled, failed, or is still pending.
            You can return to your cart and try again whenever you are ready.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm text-white/60">Payment Method</span>
              <span className="text-sm font-semibold text-white">eSewa</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-sm text-white/60">Current Status</span>
              <span className="rounded-full bg-red-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-200">
                Failed
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/cart"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Back to Cart
            </Link>

            <Link
              href="/products"
              className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Continue Shopping
            </Link>
          </div>

          <p className="mt-6 text-xs text-white/45">
            No payment will be confirmed in your system until verification succeeds.
          </p>
        </div>
      </div>
    </main>
  );
}