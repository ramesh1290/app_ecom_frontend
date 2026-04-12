import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-10 md:px-6 md:pb-20 md:pt-14 lg:px-8 lg:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-80px] top-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-[-100px] top-1/3 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur-2xl md:p-10 lg:p-12">
          <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-cyan-200">
            New Season Collection
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Discover
            <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
              {" "}
              premium style
            </span>{" "}
            for every moment
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            Shop trending fashion, modern accessories, and premium essentials
            curated to elevate your everyday lifestyle.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 px-6 py-3.5 text-sm font-semibold text-black transition duration-300 hover:scale-[1.02]"
            >
              Shop Now
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/85 backdrop-blur-md transition duration-300 hover:bg-white/10 hover:text-white"
            >
              Explore Brand
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl">
          <div className="relative h-[420px] md:h-[520px]">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
              alt="Premium ecommerce collection"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}