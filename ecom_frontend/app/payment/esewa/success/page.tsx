"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EsewaSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [message, setMessage] = useState("Verifying your payment...");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const verifyPayment = async () => {
      const token = localStorage.getItem("access");
      const data = searchParams.get("data");

      if (!token || !data || !apiBaseUrl) {
        setStatus("error");
        setMessage("Missing payment verification details.");
        return;
      }

      try {
        const res = await fetch(`${apiBaseUrl}/api/payments/esewa/verify/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data }),
        });

        const result = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(result?.message || "Payment verification failed.");
          return;
        }

        setStatus("success");
        setMessage("Payment verified successfully. Redirecting to your cart...");

        setTimeout(() => {
          router.replace("/cart");
        }, 1800);
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage("Something went wrong while verifying payment.");
      }
    };

    verifyPayment();
  }, [apiBaseUrl, router, searchParams]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 text-white">
      <div className="absolute inset-0">
        <div className="absolute left-[-80px] top-[-60px] h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-[-80px] top-[10%] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-100px] left-[35%] h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />

        <div className="relative">
          <div
            className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border ${
              status === "success"
                ? "border-emerald-400/20 bg-emerald-400/10"
                : status === "error"
                  ? "border-red-400/20 bg-red-400/10"
                  : "border-cyan-400/20 bg-cyan-400/10"
            }`}
          >
            {status === "loading" && (
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-cyan-300" />
            )}

            {status === "success" && (
              <svg
                className="h-12 w-12 text-emerald-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}

            {status === "error" && (
              <svg
                className="h-12 w-12 text-red-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            )}
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/75">
            eSewa Payment
          </p>

          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            {status === "success"
              ? "Payment Successful"
              : status === "error"
                ? "Verification Failed"
                : "Verifying Payment"}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70 md:text-base">
            {message}
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm text-white/60">Payment Method</span>
              <span className="text-sm font-semibold text-white">eSewa</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-sm text-white/60">Current Status</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                  status === "success"
                    ? "bg-emerald-400/10 text-emerald-200"
                    : status === "error"
                      ? "bg-red-400/10 text-red-200"
                      : "bg-cyan-400/10 text-cyan-200"
                }`}
              >
                {status === "success"
                  ? "Verified"
                  : status === "error"
                    ? "Error"
                    : "Processing"}
              </span>
            </div>
          </div>

          {status === "error" && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => router.replace("/cart")}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Back to Cart
              </button>

              <button
                onClick={() => router.replace("/products")}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                Continue Shopping
              </button>
            </div>
          )}

          {status !== "error" && (
            <p className="mt-6 text-xs text-white/45">
              Please wait while we securely complete your payment flow.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}