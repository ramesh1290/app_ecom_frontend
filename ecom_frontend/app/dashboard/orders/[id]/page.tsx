"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import DashboardOrderItemsList from "@/app/components/dashboard/DashboardOrderItemList";
import Logout from "@/app/components/ui/Logout";
import DashboardTopbar from "@/app/components/dashboard/DashboardTopbar";
import OrderStatusBadge from "@/app/components/dashboard/OrderStatusBadge";

interface StoredUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

interface OrderItem {
  id: number;
  product_name: string;
  product_price: string;
  quantity: number;
  total_price: string;
}

interface OrderDetail {
  id: number;
  customer_name: string;
  customer_email: string;
  transaction_uuid: string;
  total_amount: string;
  tax_amount: string;
  product_service_charge: string;
  product_delivery_charge: string;
  status: string;
  esewa_ref_id: string | null;
  esewa_transaction_code: string | null;
  created_at: string;
  items: OrderItem[];
}

export default function DashboardOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [order, setOrder] = useState<OrderDetail | null>(null);
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

    const fetchOrder = async () => {
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
        const res = await fetch(
          `${apiBaseUrl}/api/dashboard/orders/${params.id}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.replace("/");
            return;
          }

          console.error("Failed to fetch order detail");
          setOrder(null);
          return;
        }

        const result = await res.json();
        setOrder(result);
      } catch (error) {
        console.error("Order detail fetch error:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [apiBaseUrl, authChecked, allowed, params.id, router]);

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
            Loading order details...
          </div>
        </section>
      </main>
    );
  }

  if (!order) {
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
            <p className="text-lg font-semibold text-white">Order not found.</p>
            <Link
              href="/dashboard/orders"
              className="mt-4 inline-block rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/15"
            >
              Back to Orders
            </Link>
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
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/80">
                Order Details
              </p>
              <h1 className="text-4xl font-bold md:text-5xl">Order #{order.id}</h1>
              <p className="mt-3 text-sm text-white/60">
                Full order information, payment details, and purchased items.
              </p>
            </div>

            <Link
              href="/dashboard/orders"
              className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Back to Orders
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.35fr]">
          <div className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-6 shadow-2xl backdrop-blur-2xl">
              <h2 className="mb-5 text-2xl font-semibold">Order Summary</h2>

              <div className="space-y-3 text-sm text-white/70">
                <p>
                  Customer: <span className="font-medium text-white">{order.customer_name}</span>
                </p>
                <p>
                  Email: <span className="font-medium text-white">{order.customer_email}</span>
                </p>
                <p>
                  Transaction UUID:{" "}
                  <span className="font-medium text-white">{order.transaction_uuid}</span>
                </p>
                <p>
                  Created At:{" "}
                  <span className="font-medium text-white">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-6 shadow-2xl backdrop-blur-2xl">
              <h2 className="mb-5 text-2xl font-semibold">Payment Info</h2>

              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-center justify-between gap-4">
                  <span>Status</span>
                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Total Amount</span>
                  <span className="font-semibold text-white">Rs.{order.total_amount}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Tax Amount</span>
                  <span className="text-white">Rs.{order.tax_amount}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Service Charge</span>
                  <span className="text-white">Rs.{order.product_service_charge}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Delivery Charge</span>
                  <span className="text-white">Rs.{order.product_delivery_charge}</span>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <p className="mb-2">
                    eSewa Ref ID:{" "}
                    <span className="font-medium text-white">
                      {order.esewa_ref_id || "N/A"}
                    </span>
                  </p>

                  <p>
                    eSewa Transaction Code:{" "}
                    <span className="font-medium text-white">
                      {order.esewa_transaction_code || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-6 shadow-2xl backdrop-blur-2xl">
            <h2 className="mb-5 text-2xl font-semibold">Order Items</h2>
            <DashboardOrderItemsList items={order.items} />
          </div>
        </div>
      </section>
    </main>
  );
}