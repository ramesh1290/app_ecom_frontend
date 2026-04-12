import Link from "next/link";
import ProductCard from "./ProductCard";

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

const getFeaturedProducts = async (): Promise<Product[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const res = await fetch(`${baseUrl}/api/products/?featured=true`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch featured products");
  }

  return res.json();
};

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="px-4 py-16 md:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-white/60">
              Featured Collection
            </p>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Featured Products
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 backdrop-blur-md transition duration-300 hover:bg-white/10 hover:text-white"
          >
            View All Products
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70 backdrop-blur-xl">
            No featured products available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}