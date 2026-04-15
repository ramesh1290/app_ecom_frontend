interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const normalized = status?.toUpperCase?.() || "UNKNOWN";

  const classes =
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
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${classes}`}
    >
      {normalized}
    </span>
  );
}