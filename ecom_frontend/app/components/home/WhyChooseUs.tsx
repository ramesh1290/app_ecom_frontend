"use client";

import { useEffect, useState } from "react";
import SkeletonLoader from "../ui/SkeletonLoader";

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export default function WhyChooseUs() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/why-choose-us/`);
        const data = await res.json();
        console.log(data)
        setFeatures(data);
      } catch (error) {
        console.error("Failed to fetch features:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, [API_BASE]);

if (loading) {
  return (
    <section className="px-4 py-16 md:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center md:mb-14">
          <div className="h-4 w-40 mx-auto bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-8 w-2/3 mx-auto bg-white/10 rounded animate-pulse" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonLoader key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

  return (
    <section className="px-4 py-16 md:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl text-white">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300/75">
            Why Choose Us
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">
            Designed for a premium shopping experience
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => (
            <div
              key={item.id}
              className="group rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-2xl transition duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-linear-to-br from-cyan-300/15 to-purple-300/15 text-2xl text-white shadow-lg">
                {item.icon}
              </div>

              <h3 className="mt-5 text-xl font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}