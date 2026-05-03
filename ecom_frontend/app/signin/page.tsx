"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Toast from "../components/ui/Toast";

interface LoggedInUser {
  id?: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export default function SignInPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

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
      showToast("Missing API base URL.", "error");
      return;
    }

    try {
      setLoading(true);
      setFieldErrors({});

      const res = await fetch(`${apiBaseUrl}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      const user: LoggedInUser = data.user;

      showToast("Login successful.", "success");

      setTimeout(() => {
        if (user?.is_staff || user?.is_superuser) {
          router.push("/dashboard");
        } else {
          router.push("/cart");
        }
      }, 500);
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

      <section className="mx-auto grid max-w-7xl overflow-hidden rounded-[34px] border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden min-h-[600px] lg:block">
          <Image
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop"
            alt="signin"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/40 to-cyan-900/40" />
        </div>

        {/* FORM */}
        <div className="flex items-center justify-center p-6 sm:p-10">

          <div className="w-full max-w-md space-y-6">

            <div className="text-center">
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="text-white/60 text-sm mt-2">
                Sign in to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* EMAIL */}
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
                {fieldErrors.email && (
                  <p className="text-sm text-red-300 mt-2">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                  aria-label="toggle password"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-cyan-300 hover:text-cyan-200"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 py-3 font-semibold text-black hover:scale-[1.02] transition"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-white/60">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-cyan-300 hover:text-cyan-200">
                Sign up
              </Link>
            </p>

          </div>
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