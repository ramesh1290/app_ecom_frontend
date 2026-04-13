"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logout from "../components/ui/Logout";
import Link from "next/link";
import DashboardTopbar from "../components/dashboard/DashboardTopbar";

interface DashboardProduct {
  id: number;
  name: string;
  price: string;
  stock: number;
  featured: boolean;
  category_name: string;
}

interface DashboardContact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
}

interface DashboardData {
  total_products: number;
  total_categories: number;
  total_contacts: number;
  featured_products: number;
  low_stock_products: number;
  latest_products: DashboardProduct[];
  latest_contacts: DashboardContact[];
}

interface StoredUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.replace("/");
      return;
    }

    try {
      const parsedUser: StoredUser = JSON.parse(user);
      const isAdmin = !!parsedUser.is_staff || !!parsedUser.is_superuser;

      if (!isAdmin) {
        router.replace("/");
        return;
      }

      setAdminName(parsedUser.firstName || parsedUser.email || "Admin");
      setAllowed(true);
      setAuthChecked(true);
    } catch {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    if (!authChecked || !allowed) return;

    const fetchDashboard = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        router.replace("/");
        return;
      }

      if (!apiBaseUrl) {
        console.error("Missing NEXT_PUBLIC_API_BASE_URL");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiBaseUrl}/api/dashboard/summary/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.replace("/");
            return;
          }

          console.error("Dashboard fetch failed:", res.status);
          setData(null);
          return;
        }

        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [apiBaseUrl, authChecked, allowed, router]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    router.replace("/");
  };

  if (!authChecked || !allowed) {
    return null;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] px-4 py-10 text-white">
        <Logout
          open={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          onConfirm={handleLogout}
        />

        <section className="mx-auto max-w-7xl">
          <DashboardTopbar
            adminName={adminName}
            onLogout={() => setLogoutOpen(true)}
          />

          <div className="rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-8 shadow-2xl backdrop-blur-2xl">
            Loading dashboard...
          </div>
        </section>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#020617] px-4 py-10 text-white">
        <Logout
          open={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          onConfirm={handleLogout}
        />

        <section className="mx-auto max-w-7xl">
          <DashboardTopbar
            adminName={adminName}
            onLogout={() => setLogoutOpen(true)}
          />

          <div className="rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-8 shadow-2xl backdrop-blur-2xl">
            No dashboard data found.
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-10 text-white">
      <Logout
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />

      <section className="mx-auto max-w-7xl">
        <DashboardTopbar
          adminName={adminName}
          onLogout={() => setLogoutOpen(true)}
        />

        <div className="mb-8 rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/80">
                Dashboard
              </p>
              <h1 className="text-4xl font-bold md:text-5xl">Admin Overview</h1>
              <p className="mt-3 text-sm text-white/60">
                Manage your products, categories, and contact messages in one place.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <p className="text-sm text-white/70">
                Welcome, <span className="font-semibold text-white">{adminName}</span>
              </p>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                Logged in as Admin
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-[28px] border border-white/10 bg-[#0f172a]/80 p-6 shadow-xl backdrop-blur-2xl">
            <p className="text-sm text-white/60">Total Products</p>
            <h2 className="mt-3 text-3xl font-bold">{data.total_products}</h2>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0f172a]/80 p-6 shadow-xl backdrop-blur-2xl">
            <p className="text-sm text-white/60">Total Categories</p>
            <h2 className="mt-3 text-3xl font-bold">{data.total_categories}</h2>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0f172a]/80 p-6 shadow-xl backdrop-blur-2xl">
            <p className="text-sm text-white/60">Contact Messages</p>
            <h2 className="mt-3 text-3xl font-bold">{data.total_contacts}</h2>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0f172a]/80 p-6 shadow-xl backdrop-blur-2xl">
            <p className="text-sm text-white/60">Featured Products</p>
            <h2 className="mt-3 text-3xl font-bold">{data.featured_products}</h2>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0f172a]/80 p-6 shadow-xl backdrop-blur-2xl">
            <p className="text-sm text-white/60">Low Stock</p>
            <h2 className="mt-3 text-3xl font-bold">{data.low_stock_products}</h2>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-6 shadow-2xl backdrop-blur-2xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">Latest Products</h2>
              <Link
                href="/dashboard/products"
                className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/15"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {data.latest_products.length === 0 ? (
                <p className="text-sm text-white/60">No products found.</p>
              ) : (
                data.latest_products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{product.name}</p>
                        <p className="mt-1 text-sm text-white/60">
                          {product.category_name}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-white">${product.price}</p>
                        <p className="mt-1 text-sm text-white/60">
                          Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-6 shadow-2xl backdrop-blur-2xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">Latest Contacts</h2>
              <Link
                href="/dashboard/contacts"
                className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/15"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {data.latest_contacts.length === 0 ? (
                <p className="text-sm text-white/60">No contact messages found.</p>
              ) : (
                data.latest_contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="font-semibold text-white">
                      Name: {contact.first_name} {contact.last_name}
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      Email: {contact.email}
                    </p>
                    <p className="mt-2 text-sm text-cyan-300/80">
                      Subject: {contact.subject}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-white/65">
                      Message: {contact.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}