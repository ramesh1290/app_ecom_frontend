"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 2000);

      return () => clearTimeout(timer); // cleanup on unmount or when messages change
    }
  }, [successMessage, errorMessage]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ firstName, lastName, email, subject, message });
    // Here you would typically send the form data to your backend or an email service
    try {
      // Simulate successful submission
      const res = await fetch(`${apiBaseUrl}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, subject, message })
      });
      const data = await res.json();
      if (res.ok) {

        setSuccessMessage("Message sent successfully!");
        setFirstName("");
        setLastName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }
      else {
        throw new Error(data.error || "Failed to send message");
      }
    }
    catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong");
    }
  };


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
              <AnimatePresence>
                {(successMessage || errorMessage) && (
                  <motion.div
                    key={successMessage ? "success" : "error"} // 👈 IMPORTANT
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 flex items-center gap-3 rounded-xl px-4 py-3 backdrop-blur-md border ${successMessage
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                      }`}
                  >
                    <span>{successMessage ? "✅" : "❌"}</span>
                    <p className="text-sm">
                      {successMessage || errorMessage}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
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

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-cyan-400/70"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-cyan-400/70"
                />
              </div>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-cyan-400/70"
              />

              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-cyan-400/70"
              />

              <textarea
                rows={6}
                placeholder="Write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-cyan-400/70"
              />

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] cursor-pointer"
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