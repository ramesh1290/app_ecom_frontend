"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardTopbarProps {
  adminName?: string;
  onLogout: () => void;
}

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Categories", href: "/dashboard/categories" },
  { label: "Products", href: "/dashboard/products" },
  { label: "Orders", href: "/dashboard/orders" },
  { label: "WhyChooseUs", href: "/dashboard/why-choose-us" },
  { label: "About", href: "/dashboard/about" },
  { label: "Messages", href: "/dashboard/contacts" },
];

export default function DashboardTopbar({
  adminName = "Admin",
  onLogout,
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  const navLinkClass = (href: string) =>
    `rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
      isActive(href)
        ? "bg-gradient-to-r from-cyan-300 to-purple-300 text-black shadow-lg"
        : "border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="mb-8 rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-4 shadow-2xl backdrop-blur-2xl md:p-5">

      {/* TOP BAR */}
      <div className="flex items-center justify-between">

        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-300/70">
            Admin Panel
          </p>
          <h2 className="mt-1 text-xl font-bold text-white md:text-2xl">
            Dashboard Navigation
          </h2>
        </div>

        {/* HAMBURGER BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 lg:hidden"
        >
          {/* LINE 1 */}
          <span
            className={`absolute h-0.5 w-5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? "rotate-45 translate-y-0" : "-translate-y-2"
            }`}
          />

          {/* LINE 2 */}
          <span
            className={`absolute h-0.5 w-5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* LINE 3 */}
          <span
            className={`absolute h-0.5 w-5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? "-rotate-45 translate-y-0" : "translate-y-2"
            }`}
          />
        </button>

        {/* DESKTOP USER */}
        <div className="hidden items-center gap-3 lg:flex">
          <p className="text-sm text-white/65">
            Welcome, <span className="font-semibold text-white">{adminName}</span>
          </p>

          <button
            onClick={onLogout}
            className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-200 hover:bg-red-400/15"
          >
            Logout
          </button>
        </div>
      </div>

      {/* DESKTOP NAV */}
      <div className="mt-4 hidden flex-wrap gap-3 lg:flex">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
            {item.label}
          </Link>
        ))}
      </div>

      {/* MOBILE NAV (PREMIUM GLASS PANEL) */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? "max-h-[500px] mt-5" : "max-h-0"
        }`}
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">

          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="mb-3 text-sm text-white/60">
              Welcome, <span className="text-white font-semibold">{adminName}</span>
            </p>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200"
            >
              Logout
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}