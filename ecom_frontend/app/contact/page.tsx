"use client";

import Image from "next/image";

export default function ContactPage() {
  return (
    <main className="min-h-screen px-4 py-12 md:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl text-white">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          
          {/* LEFT SIDE IMAGE (simple, not heavy) */}
          <div className="relative hidden h-[500px] overflow-hidden rounded-[32px] lg:block">
            <Image
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
              alt="Contact"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* FORM (same style as signup) */}
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
            <div className="mb-8">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/70">
                Contact Us
              </p>

              <h1 className="text-3xl font-bold md:text-4xl">
                We’d love to hear from you
              </h1>

              <p className="mt-3 text-sm text-white/60">
                Send us your message and we’ll reply soon.
              </p>
            </div>

            <form className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="First name"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-cyan-400/70"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-cyan-400/70"
                />
              </div>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-cyan-400/70"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-cyan-400/70"
              />

              <textarea
                rows={6}
                placeholder="Write your message..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-cyan-400/70"
              />

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}