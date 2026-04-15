"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Logout from "../../components/ui/Logout";
import Delete from "../../components/ui/Delete";
import DashboardTopbar from "../../components/dashboard/DashboardTopbar";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  image: string | null;
  featured: boolean;
  stock: number;
  category: number;
  category_name: string;
  category_slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface StoredUser {
  firstName?: string;
  email?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  featured: false,
  image: null as File | null,
};

export default function DashboardProductsPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [authChecked, setAuthChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedDeleteProduct, setSelectedDeleteProduct] = useState<Product | null>(null);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

      setAllowed(true);
      setAuthChecked(true);
    } catch {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [message]);

  const groupedProducts = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      products: products.filter((product) => product.category === category.id),
    }));
  }, [categories, products]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    router.replace("/");
  };

  const normalizeProducts = (items: Product[]) => {
    return items.map((item) => ({
      ...item,
      image: item.image
        ? `${item.image}${item.image.includes("?") ? "&" : "?"}v=${Date.now()}`
        : null,
    }));
  };

  const fetchData = async () => {
    const token = localStorage.getItem("access");

    if (!token || !apiBaseUrl) {
      setLoading(false);
      return;
    }

    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/dashboard/products/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }),
        fetch(`${apiBaseUrl}/api/categories/`, {
          cache: "no-store",
        }),
      ]);

      if (productsRes.status === 401 || productsRes.status === 403) {
        router.replace("/");
        return;
      }

      if (!productsRes.ok) {
        setMessage({
          type: "error",
          text: "Failed to load products.",
        });
        return;
      }

      if (!categoriesRes.ok) {
        setMessage({
          type: "error",
          text: "Failed to load categories.",
        });
        return;
      }

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setProducts(normalizeProducts(productsData));
      setCategories(categoriesData);
    } catch (error) {
      console.error("Dashboard products fetch error:", error);
      setMessage({
        type: "error",
        text: "Something went wrong while loading products.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authChecked || !allowed) return;
    fetchData();
  }, [authChecked, allowed]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm((prev) => ({ ...prev, image: file }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const resetForm = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm(initialForm);
    setEditingId(null);
    setEditingImage(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (product: Product) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setEditingId(product.id);
    setEditingImage(product.image || null);
    setImagePreview(null);

    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: String(product.stock),
      category: String(product.category),
      featured: product.featured,
      image: null,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDeleteModal = (product: Product) => {
    setSelectedDeleteProduct(product);
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setDeleteOpen(false);
    setSelectedDeleteProduct(null);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("access");
    if (!token || !apiBaseUrl || !selectedDeleteProduct) return;

    try {
      setDeleteLoading(true);

      const res = await fetch(
        `${apiBaseUrl}/api/dashboard/products/${selectedDeleteProduct.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        setMessage({
          type: "error",
          text: "Failed to delete product.",
        });
        return;
      }

      setProducts((prev) =>
        prev.filter((item) => item.id !== selectedDeleteProduct.id)
      );
      setDeleteOpen(false);
      setSelectedDeleteProduct(null);
      setMessage({
        type: "success",
        text: "Product deleted successfully.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      setMessage({
        type: "error",
        text: "Something went wrong while deleting product.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("access");
    if (!token || !apiBaseUrl) return;

    if (!form.name.trim()) {
      setMessage({
        type: "error",
        text: "Product name is required.",
      });
      return;
    }

    if (!form.price.trim()) {
      setMessage({
        type: "error",
        text: "Price is required.",
      });
      return;
    }

    if (!form.stock.trim()) {
      setMessage({
        type: "error",
        text: "Stock is required.",
      });
      return;
    }

    if (!form.category) {
      setMessage({
        type: "error",
        text: "Category is required.",
      });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("category", form.category);
      formData.append("featured", String(form.featured));

      if (form.image) {
        formData.append("image", form.image);
      }

      const url = editingId
        ? `${apiBaseUrl}/api/dashboard/products/${editingId}/`
        : `${apiBaseUrl}/api/dashboard/products/`;

      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const firstError =
          data?.name?.[0] ||
          data?.slug?.[0] ||
          data?.image?.[0] ||
          data?.price?.[0] ||
          data?.stock?.[0] ||
          data?.category?.[0] ||
          data?.detail ||
          data?.non_field_errors?.[0] ||
          "Failed to save product.";

        setMessage({
          type: "error",
          text: firstError,
        });
        return;
      }

      await fetchData();
      resetForm();
      setMessage({
        type: "success",
        text: editingId
          ? "Product updated successfully."
          : "Product created successfully.",
      });
    } catch (error) {
      console.error("Submit error:", error);
      setMessage({
        type: "error",
        text: "Something went wrong while saving product.",
      });
    } finally {
      setSubmitting(false);
    }
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
          <DashboardTopbar onLogout={() => setLogoutOpen(true)} />

          <div className="rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-8 shadow-2xl backdrop-blur-2xl">
            Loading products dashboard...
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

      <Delete
        open={deleteOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedDeleteProduct?.name || "this product"}"?`}
      />

      <section className="mx-auto max-w-7xl">
        <DashboardTopbar onLogout={() => setLogoutOpen(true)} />

        <div className="mb-8 rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/80">
                Dashboard Products
              </p>
              <h1 className="text-4xl font-bold md:text-5xl">Manage Products</h1>
              <p className="mt-3 text-sm text-white/60">
                Add, edit, delete, and manage your products from your custom dashboard.
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 text-sm shadow-lg ${
              message.type === "success"
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                : "border-red-400/20 bg-red-400/10 text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div className="rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-6 shadow-2xl backdrop-blur-2xl">
            <h2 className="mb-5 text-2xl font-semibold">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product name"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
                required
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
              />

              <input
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
                required
              />

              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
                required
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="text-black">
                    {category.name}
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-3 text-sm text-white/80">
                <input
                  name="featured"
                  type="checkbox"
                  checked={form.featured}
                  onChange={handleChange}
                />
                Featured Product
              </label>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm outline-none file:mr-3 file:rounded-xl file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:text-black"
                />

                {form.image && (
                  <p className="text-xs text-white/60">
                    Selected file: <span className="text-white/80">{form.image.name}</span>
                  </p>
                )}

                {(imagePreview || editingImage) && (
                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    <img
                      src={imagePreview || editingImage || ""}
                      alt="Preview"
                      className="h-44 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-300 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:opacity-70"
                >
                  {submitting
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                      ? "Update Product"
                      : "Create Product"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-6 shadow-2xl backdrop-blur-2xl">
            <h2 className="mb-5 text-2xl font-semibold">Products by Category</h2>

            <div className="space-y-6">
              {products.length === 0 ? (
                <p className="text-sm text-white/60">No products found.</p>
              ) : (
                groupedProducts.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-[28px] border border-white/10 bg-white/5 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-white/55">
                          {category.products.length} product
                          {category.products.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    {category.products.length === 0 ? (
                      <p className="text-sm text-white/50">
                        No products in this category yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {category.products.map((product) => (
                          <div
                            key={product.id}
                            className="rounded-2xl border border-white/10 bg-[#0f172a]/70 p-4"
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <div className="flex items-center gap-4">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-20 w-20 rounded-2xl object-cover"
                                  />
                                ) : (
                                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-xs text-white/50">
                                    No Image
                                  </div>
                                )}

                                <div>
                                  <p className="text-lg font-semibold text-white">
                                    {product.name}
                                  </p>
                                  <p className="text-sm text-white/70">
                                    Rs.{product.price}
                                  </p>
                                  <p className="text-sm text-white/60">
                                    Stock: {product.stock}
                                  </p>
                                  {product.description && (
                                    <p className="mt-1 line-clamp-2 text-sm text-white/55">
                                      {product.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/15"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() => openDeleteModal(product)}
                                  className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-400/15"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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