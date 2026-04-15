"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";

interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  image: string | null;
  featured: boolean;
  stock: number;
  category_name: string;
  category_slug: string;
}

type PendingCartItem = {
  product: number;
  quantity: number;
};

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const pageFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: easeOut,
      staggerChildren: 0.1,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easeOut,
    },
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const isSubmittingRef = useRef(false);

  const slug = params.slug as string;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!apiBaseUrl) {
        setError("Missing NEXT_PUBLIC_API_BASE_URL");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${apiBaseUrl}/api/products/${slug}/`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Product not found.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [apiBaseUrl, slug]);

  const savePendingCartItem = () => {
    if (!product) return;

    const raw = localStorage.getItem("pending_cart_items");
    const pending: PendingCartItem[] = raw ? JSON.parse(raw) : [];

    const existingIndex = pending.findIndex((item) => item.product === product.id);

    if (existingIndex === -1) {
      pending.push({
        product: product.id,
        quantity: 1,
      });
    } else {
      pending[existingIndex].quantity = 1;
    }

    localStorage.setItem("pending_cart_items", JSON.stringify(pending));
  };

  const handleAddToCart = async () => {
    if (!product || adding || isSubmittingRef.current || product.stock < 1) return;

    const token = localStorage.getItem("access");

    if (!token) {
      savePendingCartItem();
      router.push("/signin?redirect=/cart");
      return;
    }

    if (!apiBaseUrl) {
      console.error("Missing NEXT_PUBLIC_API_BASE_URL");
      return;
    }

    isSubmittingRef.current = true;
    setAdding(true);

    try {
      const res = await fetch(`${apiBaseUrl}/api/cart/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: product.id,
          quantity: 1,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        savePendingCartItem();
        router.push("/signin?redirect=/cart");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Add to cart failed:", errorData);
        return;
      }

      router.push("/cart");
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      isSubmittingRef.current = false;
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
        <div className="absolute inset-0">
          <div className="absolute left-[-140px] top-[-100px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute right-[-120px] top-[10%] h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[20%] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>

        <section className="relative mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-3 backdrop-blur-2xl">
              <div className="h-[420px] animate-pulse rounded-[26px] bg-white/10 md:h-[700px]" />
            </div>

            <div className="space-y-5 rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl md:p-8">
              <div className="h-5 w-24 animate-pulse rounded-full bg-white/10" />
              <div className="h-16 w-4/5 animate-pulse rounded-2xl bg-white/10" />
              <div className="h-8 w-40 animate-pulse rounded-xl bg-white/10" />
              <div className="h-28 w-full animate-pulse rounded-[24px] bg-white/10" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-24 animate-pulse rounded-[22px] bg-white/10" />
                <div className="h-24 animate-pulse rounded-[22px] bg-white/10" />
              </div>
              <div className="h-14 w-full animate-pulse rounded-2xl bg-white/10" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
        <div className="absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute right-[-100px] bottom-[-100px] h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        <section className="relative mx-auto max-w-4xl px-4 py-16 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easeOut }}
            className="rounded-[34px] border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-12"
          >
            <h1 className="text-3xl font-bold md:text-5xl">Product not found</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/65 md:text-base">
              The product you are looking for could not be loaded.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/products"
                className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition duration-300 hover:scale-[1.03]"
              >
                Back to Products
              </Link>

              <Link
                href="/"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/85 transition duration-300 hover:bg-white/10 hover:text-white"
              >
                Go Home
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -16, 0], x: [0, 8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: easeOut }}
          className="absolute left-[-140px] top-[-100px] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 18, 0], x: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: easeOut }}
          className="absolute right-[-150px] top-[8%] h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -14, 0], x: [0, 10, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: easeOut }}
          className="absolute bottom-[-120px] left-[16%] h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/10 blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />
      </div>

      <motion.section
        variants={pageFade}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8"
      >
        <motion.div
          variants={fadeUp}
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/50"
        >
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="transition hover:text-white">
            Products
          </Link>
          <span>/</span>
          <span className="text-white/80">{product.name}</span>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div variants={fadeUp} className="relative">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.65, ease: easeOut }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-3 shadow-[0_25px_100px_rgba(0,0,0,0.58)] backdrop-blur-2xl"
              >
                <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-white/10 via-transparent to-white/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%)] opacity-60" />

                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1120]">
                  {product.image ? (
                    <>
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="h-[420px] w-full object-cover md:h-[700px]"
                        initial={{ scale: 1.08 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.2, ease: easeOut }}
                        whileHover={{ scale: 1.07 }}
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />

                      <motion.div
                        initial={{ x: "-140%" }}
                        whileHover={{ x: "140%" }}
                        transition={{ duration: 1.2, ease: easeOut }}
                        className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-md"
                      />
                    </>
                  ) : (
                    <div className="flex h-[420px] items-center justify-center text-lg font-medium text-white/50 md:h-[700px]">
                      No Image Available
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-5">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25, ease: easeOut }}
              className="rounded-[34px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.4)] backdrop-blur-2xl md:p-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: easeOut }}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200"
                >
                  {product.category_name}
                </motion.span>

                {product.featured && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4, ease: easeOut }}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70"
                  >
                    Featured
                  </motion.span>
                )}
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.55, ease: easeOut }}
                className="mt-5 text-4xl font-bold leading-tight md:text-6xl"
              >
                {product.name}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.55, ease: easeOut }}
                className="mt-5 flex flex-wrap items-center gap-4"
              >
                <p className="text-3xl font-bold text-white md:text-4xl">
                  Rs. {product.price}
                </p>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    product.stock > 0
                      ? "border border-emerald-400/20 bg-emerald-500/15 text-emerald-300"
                      : "border border-red-400/20 bg-red-500/15 text-red-300"
                  }`}
                >
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.55, ease: easeOut }}
                className="mt-6 text-sm leading-8 text-white/70 md:text-base"
              >
                {product.description ||
                  "This product is built with a clean design and a premium feel, offering a modern experience with quality, performance, and everyday usability."}
              </motion.p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: easeOut }}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                  Category
                </p>
                <p className="mt-3 text-base font-semibold text-white">
                  {product.category_name}
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: easeOut }}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                  Availability
                </p>
                <p className="mt-3 text-base font-semibold text-white">
                  {product.stock > 0 ? "Ready to order" : "Currently unavailable"}
                </p>
              </motion.div>
            </div>

            <motion.div
              variants={fadeUp}
              className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <motion.button
                  whileHover={{ scale: product.stock > 0 ? 1.02 : 1 }}
                  whileTap={{ scale: product.stock > 0 ? 0.985 : 1 }}
                  onClick={handleAddToCart}
                  disabled={adding || product.stock < 1}
                  className="group relative overflow-hidden rounded-2xl px-6 py-4 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-300 transition duration-500 group-hover:scale-105" />
                  <span className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45),transparent_55%)]" />
                  <span className="relative z-10">
                    {adding
                      ? "Adding..."
                      : product.stock > 0
                        ? "Add to Cart"
                        : "Out of Stock"}
                  </span>
                </motion.button>

                <Link
                  href="/products"
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center text-sm font-medium text-white/85 transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                >
                  Back to Products
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}