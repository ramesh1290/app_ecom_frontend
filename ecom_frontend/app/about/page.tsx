"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface About {
  id?: number;
  title: string;
  description_1: string;
  description_2?: string;

  mission_title: string;
  mission_desc: string;

  vision_title: string;
  vision_desc: string;

  image?: string | null;

  created_at?: string;
  updated_at?: string;
}

export default function AboutPage() {
  const [data, setData] = useState<About | null>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${API}/api/about/`);
        const json = await res.json();
        setData(json?.[0]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAbout();
  }, [API]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05060a] text-white">
        Loading About...
      </div>
    );
  }

  return (
    <main className="bg-[#05060a] text-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative h-[92vh] flex items-center justify-center px-6">

        {data.image && (
          <div className="absolute inset-0">
            <Image
              src={data.image}
              alt="about hero"
              fill
              priority
              className="object-cover scale-110 opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-[#05060a]" />
          </div>
        )}

        <div className="relative text-center max-w-4xl">
          <p className="text-cyan-300 tracking-[0.35em] text-xs uppercase">
            About Us
          </p>

          <h1 className="mt-5 text-5xl md:text-7xl font-semibold leading-tight">
            {data.title}
          </h1>

          <p className="mt-6 text-white/60 text-lg max-w-2xl mx-auto">
            {data.description_1}
          </p>
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-12">

        {/* LEFT TEXT */}
        <div className="space-y-8">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">
              Story
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              {data.description_2}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">
              {data.mission_title}
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              {data.mission_desc}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-xs uppercase tracking-[0.35em] text-purple-300/70">
              {data.vision_title}
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              {data.vision_desc}
            </p>
          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          <div className="sticky top-24 rounded-[28px] overflow-hidden border border-white/10 shadow-2xl">
            {data.image && (
              <Image
                src={data.image}
                alt="about visual"
                width={900}
                height={900}
                className="w-full h-[540px] object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>

      </section>

      {/* ================= FOOTER CTA ================= */}
      <section className="px-6 pb-28 text-center">

        <div className="max-w-4xl mx-auto rounded-[32px] border border-white/10 bg-white/5 p-14 backdrop-blur-xl">

          <h2 className="text-3xl md:text-5xl font-semibold">
            Experience shopping redefined
          </h2>

          <p className="mt-5 text-white/60 leading-relaxed">
            We focus on delivering a smooth, elegant, and trustworthy shopping experience
            where every product feels carefully chosen and every interaction feels effortless.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">

              <Link
                href="/products"
                className="rounded-2xl bg-white text-black px-6 py-3 font-medium hover:opacity-90 transition"
              >
                Start Shopping
              </Link>

              <Link
                href="/learn-more"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-white/80 hover:bg-white/10 transition"
              >
                Learn More
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}