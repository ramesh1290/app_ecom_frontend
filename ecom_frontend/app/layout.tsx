import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import LayoutShell from "./components/layout/LayoutShell";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Ecom | Premium Online Shopping",
    template: "%s | Ecom",
  },
  description:
    "Ecom is a modern ecommerce store for premium fashion, accessories, and everyday essentials.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 font-[var(--font-poppins)] text-white">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}