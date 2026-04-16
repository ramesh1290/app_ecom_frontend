"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#020617] text-white overflow-hidden px-4">

      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] h-[400px] w-[400px] bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] h-[400px] w-[400px] bg-purple-500/20 blur-3xl rounded-full" />
      </div>

      {/* glass container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-6 md:p-10"
      >

        {/* IMAGE SIDE */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop"
            alt="404 not found"
            className="rounded-3xl w-full h-[320px] md:h-[420px] object-cover border border-white/10 shadow-lg"
          />

          {/* overlay badge */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs text-white/70 backdrop-blur">
            ERROR 404
          </div>
        </div>

        {/* CONTENT SIDE */}
        <div className="text-center md:text-left">

          <h1 className="text-[90px] md:text-[110px] font-bold leading-none bg-gradient-to-r from-cyan-300 to-purple-400 text-transparent bg-clip-text">
            404
          </h1>

          <h2 className="text-2xl font-semibold mt-2">
            Page Not Found
          </h2>

          <p className="mt-3 text-white/60 text-sm leading-6">
            The page you are looking for doesn’t exist, has been moved,
            or the URL might be incorrect.
          </p>

          {/* buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 md:justify-start justify-center">

            <Link
              href="/"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-semibold hover:scale-105 transition"
            >
              Go Home
            </Link>

          </div>

          {/* small hint */}
          <p className="mt-6 text-xs text-white/40">
            Tip: Check the URL or return to dashboard
          </p>
        </div>
      </motion.div>
    </main>
  );
}