import Link from "next/link";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string | null;
  featured: boolean;
  stock: number;
  category_name: string;
  category_slug: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-64 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 to-white/5 text-center text-white/70">
              No Image
            </div>
          )}

          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {product.category_name}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 text-lg font-semibold text-white transition hover:text-white/80">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">
          {product.description || "Premium quality product for your everyday needs."}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-white">Rs.{product.price}</span>

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

        <button className="mt-5 w-full rounded-2xl bg-white py-3 text-sm font-semibold text-black transition hover:bg-white/90">
          Add to Cart
        </button>
      </div>
    </div>
  );
}