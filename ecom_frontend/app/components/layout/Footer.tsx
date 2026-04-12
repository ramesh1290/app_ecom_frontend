import Link from "next/link";

const footerSections = [
  {
    title: "Shop",
    links: [
      { name: "All Products", path: "/products" },
      { name: "New Arrivals", path: "/products" },
      { name: "Best Sellers", path: "/products" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", path: "/contact" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-white/5 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white">
              Ecom
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">
              Discover quality products with a modern and smooth shopping
              experience.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-base font-semibold text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ecom. All rights reserved.</p>

          <div className="flex flex-wrap gap-4">
            <Link href="#" className="transition hover:text-white">
              Facebook
            </Link>
            <Link href="#" className="transition hover:text-white">
              Instagram
            </Link>
            <Link href="#" className="transition hover:text-white">
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}