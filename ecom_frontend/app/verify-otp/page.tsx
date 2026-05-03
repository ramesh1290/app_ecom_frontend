"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "../components/ui/Toast";

export default function VerifyOTPPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const [timer, setTimer] = useState(120); // 2 minutes
  const canResend = timer === 0;

  /* ---------------- EMAIL FROM URL ---------------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") || "");
  }, []);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(
      () => setToast((prev) => ({ ...prev, show: false })),
      3000
    );
    return () => clearTimeout(t);
  }, [toast.show]);

  /* ---------------- OTP INPUT HANDLER ---------------- */
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // AUTO SUBMIT
    if (newOtp.every((v) => v !== "")) {
      handleSubmit(newOtp.join(""));
    }
  };

  /* ---------------- BACKSPACE FIX ---------------- */
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleSubmit = async (finalOtp?: string) => {
    const code = finalOtp || otp.join("");

    if (code.length !== 6) {
      showToast("Enter 6 digit OTP", "error");
      return;
    }

    if (!apiBaseUrl) return;

    try {
      setLoading(true);

      const res = await fetch(`${apiBaseUrl}/api/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Invalid OTP", "error");
        return;
      }

      showToast("OTP Verified", "success");

      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 800);
    } catch {
      showToast("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const handleResend = async () => {
    if (!canResend) return;

    try {
      setResendLoading(true);

      const res = await fetch(`${apiBaseUrl}/api/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Failed to resend OTP", "error");
        return;
      }

      setTimer(120); // reset 2 min
      setOtp(new Array(6).fill(""));
      inputsRef.current[0]?.focus();

      showToast("OTP Resent", "success");
    } catch {
      showToast("Server error", "error");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#030712] text-white px-4">

      <Toast {...toast} />

      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

        <h2 className="text-center text-3xl font-bold mb-2">
          Verify OTP
        </h2>

        <p className="text-center text-white/60 mb-8">
          Enter the 6-digit code sent to your email
        </p>

        {/* OTP BOXES */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {inputsRef.current[i] = el}}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength={1}
              className="w-12 h-14 text-center text-xl font-bold bg-white/10 border border-white/20 rounded-xl focus:border-cyan-400 outline-none"
            />
          ))}
        </div>

        {/* TIMER */}
        <p className="text-center text-sm text-white/50 mb-2">
          Resend available in:{" "}
          <span className="text-cyan-300">
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </span>
        </p>

        {/* VERIFY BUTTON */}
        <button
          onClick={() => handleSubmit()}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-semibold"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* RESEND */}
        <button
          onClick={handleResend}
          disabled={!canResend || resendLoading}
          className="w-full mt-3 py-2 text-sm text-cyan-300 disabled:opacity-40"
        >
          {resendLoading ? "Sending..." : "Resend OTP"}
        </button>

        <p className="text-center mt-6 text-sm text-white/50">
          Back to{" "}
          <Link href="/signin" className="text-cyan-300">
            Sign in
          </Link>
        </p>

      </div>
    </main>
  );
}