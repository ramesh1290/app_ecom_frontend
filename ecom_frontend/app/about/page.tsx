"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen px-4 py-12 md:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl text-white">
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* TEXT CARD */}
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300/70">
              About Our Brand
            </p>

            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Crafted for a premium shopping experience
            </h1>

            <p className="mt-5 text-sm leading-7 text-white/70 md:text-base">
              At Ecom, we believe online shopping should feel elegant, smooth,
              and trustworthy. Our goal is to deliver a modern and seamless
              experience where users can explore, discover, and purchase with
              confidence.
            </p>

            <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
              We focus on clean design, fast performance, and intuitive user
              interaction so that every step — from browsing to checkout — feels
              effortless and enjoyable.
            </p>

            {/* SMALL INFO GRID (minimal, not heavy) */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/70">
                  Our Mission
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Deliver a clean, fast, and modern e-commerce experience.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/70">
                  Our Vision
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Redefine how users interact with online shopping platforms.
                </p>
              </div>
            </div>
          </div>

          {/* IMAGE CARD */}
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl">
            <div className="relative h-full min-h-[420px]">
              <Image
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1400&auto=format&fit=crop"
                alt="Fashion store"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* overlay text (subtle, not heavy) */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
                  Experience
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Designed with simplicity and performance in mind and built to provide a premium shopping experience for users who value quality and elegance.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}