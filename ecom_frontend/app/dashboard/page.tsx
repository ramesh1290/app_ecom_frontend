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

interface DashboardOrder {
  id: number;
  customer_name: string;
  customer_email: string;
  total_amount: string;
  status: string;
  created_at: string;
}

interface DashboardData {
  total_products: number;
  total_categories: number;
  total_contacts: number;
  featured_products: number;
  low_stock_products: number;
  total_orders: number;
  paid_orders: number;
  pending_orders: number;
  latest_products: DashboardProduct[];
  latest_contacts: DashboardContact[];
  latest_orders: DashboardOrder[];
}

interface StoredUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toUpperCase() || "UNKNOWN";

  const styles =
    normalized === "PAID"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
      : normalized === "PENDING"
        ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-200"
        : normalized === "FAILED"
          ? "border-red-400/20 bg-red-400/10 text-red-200"
          : normalized === "CANCELED"
            ? "border-red-400/20 bg-red-400/10 text-red-200"
            : "border-white/10 bg-white/5 text-white/70";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${styles}`}
    >
      {normalized}
    </span>
  );
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: number | string;
  hint: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0f172a]/80 p-6 shadow-xl backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#111c31]/90">
      <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute -left-10 top-0 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-24 w-24 rounded-full bg-purple-400/10 blur-3xl" />
      </div>

      <div className="relative">
        <p className="text-sm text-white/55">{title}</p>
        <h2 className="mt-3 text-3xl font-bold text-white">{value}</h2>
        <p className="mt-2 text-xs uppercase tracking-[0.22em] text-cyan-300/70">
          {hint}
        </p>
      </div>
    </div>
  );
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

        <div className="relative mb-8 overflow-hidden rounded-[36px] border border-white/10 bg-[#0b1120]/80 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
          <div className="absolute inset-0">
            <div className="absolute left-[-60px] top-[-60px] h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute right-[-70px] top-[10%] h-44 w-44 rounded-full bg-purple-500/10 blur-3xl" />
            <div className="absolute bottom-[-70px] left-[30%] h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.32em] text-cyan-300/80">
                Dashboard
              </p>
              <h1 className="text-4xl font-bold md:text-5xl">Admin Overview</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
                Manage your products, categories, orders, and customer messages
                from one premium control panel.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <p className="text-sm text-white/70">
                Welcome, <span className="font-semibold text-white">{adminName}</span>
              </p>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                Logged in as Admin
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Products" value={data.total_products} hint="catalog" />
          <StatCard title="Total Categories" value={data.total_categories} hint="structure" />
          <StatCard title="Contact Messages" value={data.total_contacts} hint="inbox" />
          <StatCard title="Featured Products" value={data.featured_products} hint="highlighted" />
          <StatCard title="Low Stock" value={data.low_stock_products} hint="attention" />
          <StatCard title="Total Orders" value={data.total_orders} hint="sales" />
          <StatCard title="Paid Orders" value={data.paid_orders} hint="completed" />
          <StatCard title="Pending Orders" value={data.pending_orders} hint="processing" />
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
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
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{product.name}</p>
                        <p className="mt-1 text-sm text-white/60">
                          {product.category_name}
                        </p>
                        {product.featured && (
                          <p className="mt-2 inline-flex rounded-full border border-purple-400/20 bg-purple-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-200">
                            Featured
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-white">Rs.{product.price}</p>
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
              <h2 className="text-2xl font-semibold">Latest Orders</h2>
              <Link
                href="/dashboard/orders"
                className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/15"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {data.latest_orders.length === 0 ? (
                <p className="text-sm text-white/60">No orders found.</p>
              ) : (
                data.latest_orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">
                          {order.customer_name}
                        </p>
                        <p className="mt-1 text-sm text-white/60">
                          {order.customer_email}
                        </p>
                        <p className="mt-2 text-sm text-white/50">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <p className="font-semibold text-white">
                          Rs.{order.total_amount}
                        </p>
                        <StatusBadge status={order.status} />
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
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]"
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
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">
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