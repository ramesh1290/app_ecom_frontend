interface OrderItem {
  id: number;
  product_name: string;
  product_price: string;
  quantity: number;
  total_price: string;
}

interface DashboardOrderItemsListProps {
  items: OrderItem[];
}

export default function DashboardOrderItemsList({
  items,
}: DashboardOrderItemsListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-white/60">No order items found.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold text-white">{item.product_name}</p>
              <p className="mt-1 text-sm text-white/60">
                Price per item: Rs.{item.product_price}
              </p>
            </div>

            <div className="flex flex-col items-start gap-1 text-sm text-white/70 md:items-end">
              <p>Quantity: {item.quantity}</p>
              <p className="text-base font-semibold text-white">
                Total: Rs.{item.total_price}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}