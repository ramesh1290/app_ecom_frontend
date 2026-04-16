"use client";

import Image from "next/image";
import Link from "next/link";

export default function LearnMorePage() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative h-[90vh] flex items-center justify-center px-6">

        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000&auto=format&fit=crop"
            alt="shopping experience"
            fill
            className="object-cover opacity-40 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-[#05060a]" />
        </div>

        {/* Text */}
        <div className="relative text-center max-w-4xl px-4">
          <p className="text-cyan-300 tracking-[0.35em] text-xs uppercase">
            Learn More
          </p>

          <h1 className="mt-6 text-5xl md:text-7xl font-semibold leading-tight">
            A better way to experience shopping
          </h1>

          <p className="mt-6 text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
            We are building a modern e-commerce platform where design meets performance,
            and shopping feels effortless, fast, and enjoyable.
          </p>
        </div>
      </section>

      {/* ================= STORY SECTION ================= */}
      <section className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-12">

        {/* LEFT TEXT */}
        <div className="space-y-8">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">
              Our Mission
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              To create a seamless shopping experience where users can discover,
              explore, and purchase products with confidence and simplicity.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-xs uppercase tracking-[0.35em] text-purple-300/70">
              Our Vision
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              To redefine e-commerce by combining clean design, fast performance,
              and intelligent product discovery.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-xs uppercase tracking-[0.35em] text-white/60">
              Why It Matters
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              Most online stores feel heavy and outdated. We focus on clarity,
              speed, and trust — so users actually enjoy browsing.
            </p>
          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          <div className="sticky top-24 rounded-[28px] overflow-hidden border border-white/10 shadow-2xl">

            <Image
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2000&auto=format&fit=crop"
              alt="fashion shopping"
              width={900}
              height={900}
              className="w-full h-[520px] object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>

      </section>

      {/* ================= FEATURE STRIP ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-6">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h3 className="text-xl font-semibold">Fast Experience</h3>
          <p className="mt-3 text-white/60">
            Optimized for speed and smooth browsing across all devices.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h3 className="text-xl font-semibold">Secure Shopping</h3>
          <p className="mt-3 text-white/60">
            Safe checkout and trusted order handling for peace of mind.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h3 className="text-xl font-semibold">Modern Design</h3>
          <p className="mt-3 text-white/60">
            Clean, minimal UI inspired by Apple and Stripe systems.
          </p>
        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 pb-28 text-center">

        <div className="max-w-4xl mx-auto rounded-[32px] border border-white/10 bg-white/5 p-14 backdrop-blur-xl">

          <h2 className="text-3xl md:text-5xl font-semibold">
            Start exploring products today
          </h2>

          <p className="mt-5 text-white/60">
            Discover curated items designed for modern lifestyles.
          </p>

          <div className="mt-8">
            <Link
              href="/products"
              className="inline-block rounded-2xl bg-white text-black px-6 py-3 font-medium hover:opacity-90 transition"
            >
              Go to Shop
            </Link>
          </div>

        </div>

      </section>

    </main>
  );
}