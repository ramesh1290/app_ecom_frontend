"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const termsData = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content:
      "By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "accounts",
    title: "User Accounts",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.",
    image:
      "https://images.unsplash.com/photo-1556741533-f6acd647d2fb?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "usage",
    title: "Acceptable Use",
    content:
      "You agree not to misuse our services, attempt unauthorized access, or engage in any activity that disrupts platform integrity.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "ip",
    title: "Intellectual Property",
    content:
      "All content, branding, and software remain the property of the company. Unauthorized reproduction is prohibited.",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "termination",
    title: "Termination",
    content:
      "We reserve the right to suspend or terminate accounts that violate these terms without prior notice.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content:
      "We are not liable for any indirect, incidental, or consequential damages arising from the use of our services.",
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "changes",
    title: "Changes to Terms",
    content:
      "We may update these Terms at any time. Continued use of the service means you accept the updated Terms.",
    image:
      "https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function TermsOfServicePage() {
  const [active, setActive] = useState("acceptance");
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      setScroll((scrollTop / height) * 100);

      for (const item of termsData) {
        const el = document.getElementById(item.id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top < 200 && rect.bottom > 200) {
          setActive(item.id);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="relative min-h-screen bg-[#050814] text-white">

      {/* scroll progress */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-cyan-400 z-50"
        style={{ width: `${scroll}%` }}
      />

      {/* background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full top-20 left-10" />
        <div className="absolute w-[600px] h-[600px] bg-purple-500/10 blur-3xl rounded-full bottom-10 right-10" />
      </div>

      {/* LEFT SIDEBAR */}
      <aside className="fixed left-6 top-24 hidden lg:flex flex-col gap-4 text-sm z-50">
        {termsData.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`text-left transition cursor-pointer border-l pl-3 ${
              active === item.id
                ? "text-cyan-300 border-cyan-400"
                : "text-white/40 border-transparent hover:text-white"
            }`}
          >
            {item.title}
          </button>
        ))}
      </aside>

      {/* CENTER CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-16">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-white/50 mt-4">
            Clear rules that keep the platform safe and fair.
          </p>
        </motion.div>

        {/* SECTIONS */}
        {termsData.map((item, i) => (
          <motion.section
            key={item.id}
            id={item.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.03 }}
            className="group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl"
          >

            {/* IMAGE */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover scale-105 transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#050814]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10" />
            </div>

            {/* TEXT */}
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">
                {item.title}
              </h2>
              <p className="text-white/70 leading-relaxed">
                {item.content}
              </p>
            </div>

          </motion.section>
        ))}
      </div>
    </main>
  );
}