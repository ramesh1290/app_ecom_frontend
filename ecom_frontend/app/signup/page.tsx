"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Toast from "../components/ui/Toast";

export default function SignUpPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required.";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fill all required fields correctly.", "error");
      return;
    }

    if (!apiBaseUrl) {
      showToast("Missing API base URL. Check .env.local", "error");
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const res = await fetch(`${apiBaseUrl}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data?.message || "Signup failed. Please try again.", "error");
        return;
      }

      showToast(data.message || "Account created successfully.", "success");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch {
      showToast("Unable to connect to the server.", "error");
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
        <div className="absolute left-1/2 top-1/3 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <section className="relative mx-auto grid min-h-[86vh] max-w-7xl overflow-hidden rounded-[34px] border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-2">
        <div className="relative hidden min-h-[580px] lg:block">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop"
            alt="Signup visual"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/35 to-cyan-900/40" />

          <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-12">
            <div>
              <p className="inline-block rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200 backdrop-blur-md">
                Get Started
              </p>
            </div>

            <div className="max-w-md">
              <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                Create your account and step into a modern premium interface
              </h1>
              <p className="mt-4 text-sm leading-6 text-white/75">
                Join now and enjoy a smooth signup experience with elegant
                glassmorphism design and clean interaction.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-8 sm:px-8 md:px-10">
          <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
            <div className="mb-8 text-center">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/80">
                Sign Up
              </p>
              <h2 className="text-3xl font-bold md:text-4xl">
                Create your account
              </h2>
              <p className="mt-3 text-sm text-white/60">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-xl transition focus:border-cyan-400/70 focus:bg-white/10"
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-xs text-red-300">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-xl transition focus:border-cyan-400/70 focus:bg-white/10"
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-xs text-red-300">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-xl transition focus:border-cyan-400/70 focus:bg-white/10"
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-red-300">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-xl transition focus:border-cyan-400/70 focus:bg-white/10"
                />
                {errors.password && (
                  <p className="mt-2 text-xs text-red-300">{errors.password}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-xl transition focus:border-cyan-400/70 focus:bg-white/10"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-xs text-red-300">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:opacity-70"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-white/60">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}