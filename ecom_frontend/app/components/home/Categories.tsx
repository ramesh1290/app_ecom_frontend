import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  product_count?: number;
  description?: string;
}

const getCategories = async (): Promise<Category[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const res = await fetch(`${baseUrl}/api/categories/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
};

export default async function Categories() {
  const categories = await getCategories();

  return (
    <section className="px-4 py-16 md:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-white/60">
              Browse Collection
            </p>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Shop by Categories
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 backdrop-blur-md transition duration-300 hover:bg-white/10 hover:text-white"
          >
            View All Products
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70 backdrop-blur-xl">
            No categories available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/10"
              >
                <div className="relative h-72">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 via-white/5 to-transparent px-6 text-center">
                      <span className="text-2xl font-semibold tracking-wide text-white/80">
                        {cat.name}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  <div className="absolute left-0 top-0 p-4">
                    <span className="inline-flex rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-md">
                      {cat.product_count ?? 0} Items
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-5">
                    <h3 className="text-2xl font-semibold text-white transition duration-300 group-hover:translate-x-1">
                      {cat.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/70">
                      {cat.description ??
                        `Explore the latest ${cat.name.toLowerCase()} collection.`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}