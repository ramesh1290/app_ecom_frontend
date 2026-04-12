const features = [
  {
    title: "Premium Quality",
    description:
      "We carefully select products that combine style, durability, and everyday value.",
    icon: "✦",
  },
  {
    title: "Fast Delivery",
    description:
      "Enjoy quick and reliable shipping so your favorite products reach you fast.",
    icon: "⚡",
  },
  {
    title: "Secure Payments",
    description:
      "Shop with confidence through a safe and trusted checkout experience.",
    icon: "🔒",
  },
  {
    title: "Customer Support",
    description:
      "Our team is ready to assist whenever you need help.",
    icon: "✉",
  },
];

export default function WhyChooseUs() {
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
              key={item.title}
              className="group rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-2xl transition duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-300/15 to-purple-300/15 text-2xl text-white shadow-lg">
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