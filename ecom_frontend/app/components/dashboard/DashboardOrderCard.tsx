"use client";

import Link from "next/link";
import OrderStatusBadge from "./OrderStatusBadge";

interface DashboardOrderCardProps {
  order: {
    id: number;
    customer_name: string;
    customer_email: string;
    transaction_uuid: string;
    total_amount: string;
    status: string;
    total_items: number;
    created_at: string;
  };
}

export default function DashboardOrderCard({ order }: DashboardOrderCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">{order.customer_name}</p>
          <p className="mt-1 text-sm text-white/60">{order.customer_email}</p>
          <p className="mt-2 text-xs text-white/45">
            Transaction: {order.transaction_uuid}
          </p>
          <p className="mt-2 text-sm text-white/60">
            Items: {order.total_items}
          </p>
          <p className="mt-1 text-sm text-white/60">
            Date: {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <p className="text-xl font-bold text-white">Rs.{order.total_amount}</p>
          <OrderStatusBadge status={order.status} />

          <Link
            href={`/dashboard/orders/${order.id}`}
            className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/15"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}