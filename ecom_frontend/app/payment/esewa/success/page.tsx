"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function EsewaSuccessContent() {
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
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <h1 className="text-3xl font-bold">
          {status === "success"
            ? "Payment Successful"
            : status === "error"
              ? "Verification Failed"
              : "Verifying Payment"}
        </h1>

        <p className="mt-4 text-white/70">{message}</p>
      </div>
    </main>
  );
}

export default function EsewaSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-black text-white">
          Loading payment...
        </main>
      }
    >
      <EsewaSuccessContent />
    </Suspense>
  );
}