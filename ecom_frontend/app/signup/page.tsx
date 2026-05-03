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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        headers: { "Content-Type": "application/json" },
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
        showToast(data?.message || "Signup failed.", "error");
        return;
      }

      showToast(data.message || "Account created successfully.", "success");

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch {
      showToast("Unable to connect to server.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ICONS (clean modern SVG) ---------------- */

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
      <path d="M17.94 17.94C16.2 19.2 14.16 20 12 20 6 20 2.5 12 2.5 12a21.9 21.9 0 015.17-6.3" />
      <path d="M9.9 4.24A10.7 10.7 0 0112 4c6 0 9.5 8 9.5 8a20.2 20.2 0 01-4.1 5.2" />
      <path d="M14.12 14.12A3 3 0 119.88 9.88" />
      <path d="M3 3l18 18" />
    </svg>
  );

  return (
    <main className="relative min-h-screen bg-[#030712] px-4 py-10 text-white">

      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <section className="mx-auto grid max-w-7xl lg:grid-cols-2 rounded-[34px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.45)]">

        {/* LEFT IMAGE */}
        <div className="relative hidden lg:block min-h-[600px]">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop"
            alt="signup"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-cyan-900/40" />
        </div>

        {/* FORM */}
        <div className="flex items-center justify-center p-6 sm:p-10">

          <div className="w-full max-w-md space-y-6">

            <div className="text-center">
              <h2 className="text-3xl font-bold">Create Account</h2>
              <p className="text-white/60 text-sm mt-2">Join and start your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid grid-cols-2 gap-4">
                <input className="input" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                <input className="input" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>

              <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />

              {/* PASSWORD */}
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
                  className="input pr-10"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <button
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 py-3 font-semibold text-black hover:scale-[1.01] transition"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

            </form>

            <p className="text-center text-sm text-white/60">
              Already have an account?{" "}
              <Link href="/signin" className="text-cyan-300 hover:text-cyan-200">
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </section>

      {/* reusable input style */}
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