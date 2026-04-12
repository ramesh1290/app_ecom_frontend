export default function Newsletter() {
  return (
    <section className="px-4 py-16 md:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur-2xl md:p-10 lg:p-14">
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300/75">
                Stay Updated
              </p>

              <h2 className="text-3xl font-bold leading-tight md:text-4xl">
                Join our newsletter for exclusive offers and latest arrivals
              </h2>
            </div>

            <div className="w-full max-w-xl">
              <form className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-white/35 outline-none backdrop-blur-md transition focus:border-cyan-300/30 focus:bg-white/10"
                  />

                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 px-6 py-4 text-sm font-semibold text-black transition duration-300 hover:scale-[1.02]"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}