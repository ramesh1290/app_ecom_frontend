"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const privacyData = [
  {
    id: "info",
    title: "Information We Collect",
    content:
      "We collect information you provide directly such as name, email, and account details. We also collect usage data to improve our services.",
    image:
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "usage",
    title: "How We Use Your Information",
    content:
      "We use your information to provide services, improve user experience, send OTPs, and ensure account security.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "otp",
    title: "OTP & Security",
    content:
      "We use time-limited OTPs for authentication and password recovery with secure transmission.",
    image:
      "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "security",
    title: "Data Protection",
    content:
      "We use encryption, secure servers, and strict access controls to protect your data.",
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "thirdparty",
    title: "Third-Party Services",
    content:
      "We may use trusted third-party services like analytics, email, and cloud providers.",
    image:
      "https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "cookies",
    title: "Cookies",
    content:
      "We use cookies to improve UX, maintain sessions, and analyze traffic.",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "rights",
    title: "Your Rights",
    content:
      "You can access, update, or delete your data anytime by contacting support.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "changes",
    title: "Changes to Policy",
    content:
      "We may update this policy. All changes will appear on this page.",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
  },
  
  
];

export default function PrivacyPolicyPage() {
  const [active, setActive] = useState("info");
  const [scroll, setScroll] = useState(0);

  // scroll progress + active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      setScroll((scrollTop / height) * 100);

      for (const item of privacyData) {
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
        {privacyData.map((item) => (
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
            Privacy Policy
          </h1>
          <p className="text-white/50 mt-4">
            Simple, transparent, and built for trust.
          </p>
        </motion.div>

        {/* SECTIONS */}
        {privacyData.map((item, i) => (
          <motion.section
            key={item.id}
            id={item.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.03 }}
            className="group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl"
          >

            {/* CLASSY IMAGE */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover scale-105 transition duration-700 group-hover:scale-110"
              />

              {/* cinematic overlay */}
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