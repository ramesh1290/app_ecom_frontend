"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Toast from "../components/ui/Toast";

export default function SignInPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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

    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = "Email is required.";
    if (!password.trim()) errors.password = "Password is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast("Please fill all fields.", "error");
      return;
    }

    if (!apiBaseUrl) {
      showToast("Missing API base URL. Check .env.local", "error");
      return;
    }

    try {
      setLoading(true);
      setFieldErrors({});

      const res = await fetch(`${apiBaseUrl}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data?.message || "Invalid credentials.", "error");
        return;
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      showToast("Login successful.", "success");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        router.push("/products");
      }, 400);
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
        <div className="absolute left-1/2 top-1/3 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <section className="relative mx-auto grid min-h-[86vh] max-w-7xl overflow-hidden rounded-[34px] border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-2">
        <div className="relative hidden min-h-[580px] lg:block">
          <Image
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop"
            alt="Signin visual"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/45 to-cyan-900/40" />

          <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-12">
            <div>
              <p className="inline-block rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200 backdrop-blur-md">
                Welcome Back
              </p>
            </div>

            <div className="max-w-md">
              <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                Sign in and continue your premium shopping experience
              </h1>
              <p className="mt-4 text-sm leading-6 text-white/75">
                Access your account, explore products, and continue with a
                clean, modern, glass-style interface.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-8 sm:px-8 md:px-10">
          <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
            <div className="mb-8 text-center">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/80">
                Sign In
              </p>
              <h2 className="text-4xl font-bold md:text-5xl">Welcome back</h2>
              <p className="mt-3 text-sm text-white/60">
                Enter your details to access your account
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
                {fieldErrors.email && (
                  <p className="mt-2 text-sm text-red-300">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base text-white placeholder:text-white/40 outline-none backdrop-blur-xl transition focus:border-cyan-400/70 focus:bg-white/10"
                />
                {fieldErrors.password && (
                  <p className="mt-2 text-sm text-red-300">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 py-4 text-base font-semibold text-black transition hover:scale-[1.02] disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-white/60">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}