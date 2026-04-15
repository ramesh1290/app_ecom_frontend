"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayout = pathname.startsWith("/dashboard") || pathname.startsWith("/cart");

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}