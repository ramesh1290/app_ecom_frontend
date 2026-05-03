"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Toast from "../components/ui/Toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (!password.trim() || !confirmPassword.trim()) {
      setFieldError("All fields are required.");
      showToast("Please fill all fields.", "error");
      return;
    }

    if (password.length < 6) {
      setFieldError("Password must be at least 6 characters.");
      showToast("Password too short.", "error");
      return;
    }

    if (password !== confirmPassword) {
      setFieldError("Passwords do not match.");
      showToast("Passwords do not match.", "error");
      return;
    }

    if (!apiBaseUrl) {
      showToast("Missing API base URL.", "error");
      return;
    }

    try {
      setLoading(true);
      setFieldError("");

      const res = await fetch(`${apiBaseUrl}/api/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data?.message || "Failed to reset password.", "error");
        return;
      }

      showToast("Password reset successful.", "success");

      setTimeout(() => router.push("/signin"), 1000);
    } catch {
      showToast("Server error. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ICONS ---------------- */

  const EyeIcon = () => (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94C16.2 19.2 14.16 20 12 20C6 20 2.5 12 2.5 12" />
      <path d="M3 3l18 18" />
      <path d="M9.9 4.24A10.7 10.7 0 0112 4c6 0 9.5 8 9.5 8" />
      <path d="M14.12 14.12A3 3 0 119.88 9.88" />
    </svg>
  );

  return (
    <main className="relative min-h-screen bg-[#030712] px-4 py-10 text-white">

      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <section className="mx-auto flex min-h-[86vh] max-w-7xl items-center justify-center rounded-[34px] border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">

        <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-white/10 p-8 backdrop-blur-2xl sm:p-10">

          <div className="mb-8 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/80">
              Reset Password
            </p>
            <h2 className="text-4xl font-bold md:text-5xl">
              Create new password
            </h2>
            <p className="mt-3 text-sm text-white/60">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* NEW PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input pr-10"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>

              {fieldError && (
                <p className="mt-2 text-sm text-red-300">{fieldError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 py-3 font-semibold text-black hover:scale-[1.02] transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

          </form>

          <p className="mt-8 text-center text-sm text-white/60">
            Back to{" "}
            <Link href="/signin" className="text-cyan-300 hover:text-cyan-200">
              Sign in
            </Link>
          </p>

        </div>
      </section>

      {/* shared input style */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          outline: none;
          font-size: 14px;
          color: white;
          transition: 0.2s;
        }

        .input:focus {
          border-color: rgba(34,211,238,0.6);
          background: rgba(255,255,255,0.08);
        }
      `}</style>

    </main>
  );
}