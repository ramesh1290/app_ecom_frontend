"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logout from "../../components/ui/Logout";
import DashboardTopbar from "../../components/dashboard/DashboardTopbar";
import DashboardOrderCard from "../../components/dashboard/DashboardOrderCard";

interface StoredUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

interface DashboardOrder {
  id: number;
  customer_name: string;
  customer_email: string;
  transaction_uuid: string;
  total_amount: string;
  status: string;
  total_items: number;
  created_at: string;
}

export default function DashboardOrdersPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [orders, setOrders] = useState<DashboardOrder[]>([]);
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

    const fetchOrders = async () => {
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
        const res = await fetch(`${apiBaseUrl}/api/dashboard/orders/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.replace("/");
            return;
          }

          console.error("Failed to fetch orders");
          setOrders([]);
          return;
        }

        const result = await res.json();
        setOrders(result);
      } catch (error) {
        console.error("Orders fetch error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [apiBaseUrl, authChecked, allowed, router]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    router.replace("/");
  };

  if (!authChecked || !allowed) return null;

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
            Loading orders...
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
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/80">
            Dashboard Orders
          </p>
          <h1 className="text-4xl font-bold md:text-5xl">Manage Orders</h1>
          <p className="mt-3 text-sm text-white/60">
            View all placed orders, payment status, and transaction details.
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-6 shadow-2xl backdrop-blur-2xl">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">All Orders</h2>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              Total Orders: {orders.length}
            </div>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-sm text-white/60">No orders found.</p>
            ) : (
              orders.map((order) => (
                <DashboardOrderCard key={order.id} order={order} />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}