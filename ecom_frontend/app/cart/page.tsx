"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Logout from "../components/ui/Logout";

interface CartItem {
  id: number;
  product: number;
  product_name: string;
  product_slug: string;
  product_price: string;
  product_image: string | null;
  quantity: number;
  total_price: number | string;
}

interface PendingCartItem {
  product: number;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const getImageUrl = (image: string | null) => {
    if (!image) return null;
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    return `${apiBaseUrl}${image}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("pending_cart_items");
    router.push("/");
  };

  const syncPendingCartToBackend = async (token: string) => {
    const raw = localStorage.getItem("pending_cart_items");
    const pending: PendingCartItem[] = raw ? JSON.parse(raw) : [];

    if (!pending.length || !apiBaseUrl) return;

    for (const item of pending) {
      try {
        await fetch(`${apiBaseUrl}/api/cart/add/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product: item.product,
            quantity: item.quantity,
          }),
        });
      } catch (error) {
        console.error("Pending cart sync failed:", error);
      }
    }

    localStorage.removeItem("pending_cart_items");
  };

  const fetchCart = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/signin?redirect=/cart");
      return;
    }

    if (!apiBaseUrl) {
      console.error("Missing NEXT_PUBLIC_API_BASE_URL");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      await syncPendingCartToBackend(token);

      const res = await fetch(`${apiBaseUrl}/api/cart/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (res.status === 401 || res.status === 403) {
        router.push("/signin?redirect=/cart");
        return;
      }

      if (!res.ok) {
        console.error("Failed to fetch cart");
        setCartItems([]);
        return;
      }

      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error("Cart fetch error:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const access = localStorage.getItem("access");
    const user = localStorage.getItem("user");

    if (!access) {
      router.push("/signin?redirect=/cart");
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

    fetchCart();
  }, []);

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/signin?redirect=/cart");
      return;
    }

    if (!apiBaseUrl) {
      console.error("Missing NEXT_PUBLIC_API_BASE_URL");
      return;
    }

    try {
      setUpdatingId(id);

      const res = await fetch(`${apiBaseUrl}/api/cart/${id}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (res.status === 401 || res.status === 403) {
        router.push("/signin?redirect=/cart");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Update failed:", errorData);
        return;
      }

      if (quantity < 1) {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        return;
      }

      const result = await res.json();

      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? result.data : item))
      );
    } catch (error) {
      console.error("Update quantity error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteItem = async (id: number) => {
    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/signin?redirect=/cart");
      return;
    }

    if (!apiBaseUrl) {
      console.error("Missing NEXT_PUBLIC_API_BASE_URL");
      return;
    }

    try {
      setDeletingId(id);

      const res = await fetch(`${apiBaseUrl}/api/cart/${id}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        router.push("/signin?redirect=/cart");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Delete failed:", errorData);
        return;
      }

      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete item error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + Number(item.total_price), 0);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[36px] border border-white/10 bg-[#0b1120]/80 p-8 text-white shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-10">
            <div className="mb-4 h-8 w-52 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-72 animate-pulse rounded bg-white/10" />

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
              <div className="space-y-5">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="rounded-[32px] border border-white/10 bg-[#0f172a]/80 p-5 backdrop-blur-2xl"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row">
                      <div className="h-32 w-full animate-pulse rounded-2xl bg-white/10 sm:w-32" />
                      <div className="flex-1">
                        <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
                        <div className="mt-3 h-4 w-28 animate-pulse rounded bg-white/10" />
                        <div className="mt-5 h-10 w-full animate-pulse rounded-2xl bg-white/10" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-[32px] border border-white/10 bg-[#0f172a]/80 p-6 backdrop-blur-2xl">
                <div className="h-7 w-40 animate-pulse rounded bg-white/10" />
                <div className="mt-6 h-24 animate-pulse rounded-2xl bg-white/10" />
                <div className="mt-6 h-12 animate-pulse rounded-2xl bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative mb-10 overflow-hidden rounded-[36px] border border-white/10 bg-[#0b1120]/80 p-8 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-10"
        >
          <div className="absolute inset-0">
            <div className="absolute left-[-50px] top-[-50px] h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute bottom-[-50px] right-[-50px] h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-white/55">
                Your Cart
              </p>

              <h1 className="text-4xl font-bold md:text-5xl">
                Shopping Cart
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
                Review your selected items, update quantities, and continue your
                premium shopping experience.
              </p>

              {userName && (
                <p className="mt-4 text-sm text-white/70">
                  Signed in as{" "}
                  <span className="font-semibold text-white">{userName}</span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                Continue Shopping
              </Link>

              <button
                onClick={() => setLogoutOpen(true)}
                className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/15 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {cartItems.length === 0 ? (
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
                  <circle
                    cx="120"
                    cy="120"
                    r="92"
                    stroke="currentColor"
                    strokeWidth="10"
                    opacity="0.15"
                  />
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
                </svg>
              </div>

              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/75">
                Empty Cart
              </p>

              <h2 className="text-3xl font-bold md:text-4xl">
                Your cart is waiting
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 md:text-base">
                You haven&apos;t added anything yet. Explore the collection and
                bring your favorite products here.
              </p>

              <Link
                href="/products"
                className="mt-8 rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Browse Products
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.65fr_0.85fr]">
            <div className="space-y-5">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="rounded-[32px] border border-white/10 bg-[#0f172a]/80 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.38)] backdrop-blur-2xl"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <Link
                      href={`/products/${item.product_slug}`}
                      className="h-32 w-full overflow-hidden rounded-2xl bg-white/5 sm:w-32"
                    >
                      {item.product_image ? (
                        <img
                          src={getImageUrl(item.product_image) || ""}
                          alt={item.product_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-white/50">
                          No Image
                        </div>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link href={`/products/${item.product_slug}`}>
                          <h2 className="text-xl font-semibold text-white transition hover:text-white/85">
                            {item.product_name}
                          </h2>
                        </Link>

                        <p className="mt-2 text-sm text-white/55">
                          Price per item: Rs.{item.product_price}
                        </p>
                      </div>

                      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={updatingId === item.id}
                            className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 text-lg text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            -
                          </button>

                          <div className="min-w-[54px] text-center text-base font-semibold text-white">
                            {item.quantity}
                          </div>

                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={updatingId === item.id}
                            className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 text-lg text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-lg font-bold text-white">
                            Rs.{Number(item.total_price).toFixed(2)}
                          </p>

                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={deletingId === item.id}
                            className="rounded-2xl bg-red-500/15 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                          >
                            {deletingId === item.id ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-fit rounded-[32px] border border-white/10 bg-[#0f172a]/80 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.38)] backdrop-blur-2xl"
            >
              <h2 className="text-2xl font-semibold text-white">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-white/70">
                  <span>Total Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex items-center justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>Rs.{subtotal.toFixed(2)}</span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between text-lg font-bold text-white">
                    <span>Total</span>
                    <span>Rs.{subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] cursor-pointer">
                Proceed to Checkout
              </button>

              <p className="mt-4 text-center text-xs text-white/45">
                Fast, elegant, and secure checkout flow coming next.
              </p>
            </motion.div>
          </div>
        )}
      </section>
    </main>
  );
}