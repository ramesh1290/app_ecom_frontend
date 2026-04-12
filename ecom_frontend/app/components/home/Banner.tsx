import Link from "next/link";

export default function Banner() {
  return (
    <section className="px-4 py-16 md:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1400&q=80"
              alt="Special collection banner"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
          </div>

          <div className="relative grid gap-8 px-6 py-12 text-white md:px-10 md:py-16 lg:grid-cols-[1fr_auto] lg:items-center lg:px-14">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300/75">
                Limited Time Offer
              </p>
              <h2 className="max-w-3xl text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                Elevate your wardrobe with our exclusive seasonal deals
              </h2>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 px-6 py-3.5 text-sm font-semibold text-black transition duration-300 hover:scale-[1.02]"
              >
                Shop Collection
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-md transition duration-300 hover:bg-white/15"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}