"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Logout from "../components/ui/Logout";

interface Product {
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

interface Category {
  id: number;
  name: string;
  slug: string;
}

const formatCategory = (value?: string | null) => {
  if (!value) return "Explore Products";

  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function EmptyState({ category }: { category?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#0f172a]/80 p-8 text-white shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-12"
    >
      <div className="absolute inset-0">
        <div className="absolute left-[-50px] top-[-50px] h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-50px] right-[-50px] h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center text-center">
        <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <svg
            viewBox="0 0 240 240"
            className="h-16 w-16 text-white/80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="120" cy="120" r="92" stroke="currentColor" strokeWidth="10" opacity="0.15" />
            <path
              d="M77 92H163L156 160H84L77 92Z"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinejoin="round"
              opacity="0.9"
            />
            <path
              d="M97 92C97 79 107 68 120 68C133 68 143 79 143 92"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M95 117H145"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.45"
            />
          </svg>
        </div>

        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/75">
          Nothing Here Yet
        </p>

        <h2 className="text-3xl font-bold md:text-4xl">
          No products found
          {category ? ` in ${formatCategory(category)}` : ""}
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 md:text-base">
          We couldn&apos;t find any matching products right now. Try another category
          or go back to view everything available in the store.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/products"
            className="rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            Browse All Products
          </Link>

          <Link
            href="/"
            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="group"
    >
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0f172a]/80 shadow-[0_14px_45px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_22px_60px_rgba(0,0,0,0.5)]">
        <div className="relative h-72 overflow-hidden">
          {product.image ? (
            <motion.img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 via-white/5 to-transparent text-white/60">
              No Image
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute left-4 top-4">
            <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              {product.category_name}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-xl font-semibold text-white transition duration-300 group-hover:text-white/90">
            {product.name}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">
            {product.description ||
              "Premium quality product designed for a clean, modern lifestyle."}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-2xl font-bold text-white">${product.price}</span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                product.stock > 0
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-red-500/15 text-red-300"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="mt-5 flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="flex-1 rounded-2xl bg-white py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Add to Cart
            </motion.button>

            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                href={`/products/${product.slug}`}
                className="block rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                View
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [userName, setUserName] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);

  const heading = useMemo(() => {
    return category ? `${formatCategory(category)} Collection` : "Explore Products";
  }, [category]);

  useEffect(() => {
    const access = localStorage.getItem("access");
    const user = localStorage.getItem("user");

    if (!access) {
      router.push("/signin");
      return;
    }

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserName(parsedUser.firstName || parsedUser.email || "");
      } catch {
        setUserName("");
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    router.push("/");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      if (!apiBaseUrl) {
        console.error("Missing NEXT_PUBLIC_API_BASE_URL");
        setCategories([]);
        setLoadingCategories(false);
        return;
      }

      try {
        setLoadingCategories(true);

        const res = await fetch(`${apiBaseUrl}/api/categories/`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [apiBaseUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!apiBaseUrl) {
        console.error("Missing NEXT_PUBLIC_API_BASE_URL");
        setProducts([]);
        setLoadingProducts(false);
        return;
      }

      try {
        setLoadingProducts(true);

        let url = `${apiBaseUrl}/api/products/`;
        if (category) {
          url += `?category=${category}`;
        }

        const res = await fetch(url, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [category, apiBaseUrl]);

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-12 md:px-6 lg:px-8">
      <Logout
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />

      <section className="mx-auto max-w-7xl text-white">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mb-12 overflow-hidden rounded-[36px] border border-white/10 bg-[#0b1120]/80 p-8 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-10"
        >
          <div className="absolute inset-0">
            <div className="absolute left-[-60px] top-[-60px] h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute bottom-[-70px] right-[-70px] h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-white/55">
                Our Collection
              </p>

              <h1 className="text-4xl font-bold md:text-5xl">{heading}</h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
                Discover premium products curated for a clean, modern, and
                refined shopping experience.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              {userName && (
                <p className="text-sm text-white/70">
                  Welcome, <span className="font-semibold text-white">{userName}</span>
                </p>
              )}

              <button
                onClick={() => setLogoutOpen(true)}
                className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/15"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: "easeOut" }}
          className="mb-10 flex flex-col gap-4 rounded-[32px] border border-white/10 bg-[#0b1120]/75 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                !category
                  ? "bg-white text-black shadow-lg"
                  : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              All
            </Link>

            {loadingCategories
              ? [...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-24 animate-pulse rounded-full border border-white/10 bg-white/10"
                  />
                ))
              : categories.map((item) => {
                  const isActive = category === item.slug;

                  return (
                    <Link
                      key={item.id}
                      href={`/products?category=${item.slug}`}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-white text-black shadow-lg"
                          : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
            {loadingProducts ? "Loading..." : `${products.length} Products`}
          </div>
        </motion.div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0f172a]/80 shadow-xl backdrop-blur-2xl"
              >
                <div className="h-72 animate-pulse bg-white/10" />
                <div className="p-5">
                  <div className="h-6 w-2/3 animate-pulse rounded bg-white/10" />
                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />
                  <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-white/10" />
                  <div className="mt-5 h-10 w-full animate-pulse rounded-2xl bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState category={category} />
        ) : (
          <motion.div
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={fadeUp}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}