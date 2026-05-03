"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Toast from "../components/ui/Toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setFieldError("Email is required.");
      showToast("Please enter your email.", "error");
      return;
    }

    if (!apiBaseUrl) {
      showToast("Missing API base URL. Check .env.local", "error");
      return;
    }

    try {
      setLoading(true);
      setFieldError("");

      const res = await fetch(`${apiBaseUrl}/api/forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data?.message || "Failed to send OTP.", "error");
        return;
      }

      showToast("OTP sent to your email.", "success");

      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 800);
    } catch {
      showToast("Server error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] px-4 py-10 text-white">
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-[260px] w-[260px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] h-[280px] w-[280px] rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-[86vh] max-w-7xl items-center justify-center rounded-[34px] border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
          <div className="mb-8 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/80">
              Forgot Password
            </p>
            <h2 className="text-4xl font-bold md:text-5xl">Reset password</h2>
            <p className="mt-3 text-sm text-white/60">
              Enter your email and we&apos;ll send you a 6-digit OTP
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base text-white placeholder:text-white/40 outline-none backdrop-blur-xl transition focus:border-cyan-400/70 focus:bg-white/10"
              />
              {fieldError && (
                <p className="mt-2 text-sm text-red-300">{fieldError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 py-4 text-base font-semibold text-black transition hover:scale-[1.02] disabled:opacity-70"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/60">
            Back to{" "}
            <Link
              href="/signin"
              className="font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}