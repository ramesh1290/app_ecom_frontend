"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Logout from "../../components/ui/Logout";
import Delete from "../../components/ui/Delete";
import DashboardTopbar from "../../components/dashboard/DashboardTopbar";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  product_count?: number;
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
  image: null as File | null,
};

export default function DashboardCategoriesPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [authChecked, setAuthChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedDeleteCategory, setSelectedDeleteCategory] = useState<Category | null>(null);

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

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    router.replace("/");
  };

  const normalizeCategories = (items: Category[]) => {
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
      const res = await fetch(`${apiBaseUrl}/api/dashboard/categories/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (res.status === 401 || res.status === 403) {
        router.replace("/");
        return;
      }

      if (!res.ok) {
        setMessage({
          type: "error",
          text: "Failed to load categories.",
        });
        return;
      }

      const categoriesData = await res.json();
      setCategories(normalizeCategories(categoriesData));
    } catch (error) {
      console.error("Dashboard categories fetch error:", error);
      setMessage({
        type: "error",
        text: "Something went wrong while loading categories.",
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
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

  const handleEdit = (category: Category) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setEditingId(category.id);
    setEditingImage(category.image || null);
    setImagePreview(null);

    setForm({
      name: category.name,
      description: category.description || "",
      image: null,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDeleteModal = (category: Category) => {
    setSelectedDeleteCategory(category);
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setDeleteOpen(false);
    setSelectedDeleteCategory(null);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("access");
    if (!token || !apiBaseUrl || !selectedDeleteCategory) return;

    try {
      setDeleteLoading(true);

      const res = await fetch(
        `${apiBaseUrl}/api/dashboard/categories/${selectedDeleteCategory.id}/`,
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
          text: "Failed to delete category.",
        });
        return;
      }

      setCategories((prev) =>
        prev.filter((item) => item.id !== selectedDeleteCategory.id)
      );
      setDeleteOpen(false);
      setSelectedDeleteCategory(null);
      setMessage({
        type: "success",
        text: "Category deleted successfully.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      setMessage({
        type: "error",
        text: "Something went wrong while deleting category.",
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
        text: "Category name is required.",
      });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());

      if (form.image) {
        formData.append("image", form.image);
      }

      const url = editingId
        ? `${apiBaseUrl}/api/dashboard/categories/${editingId}/`
        : `${apiBaseUrl}/api/dashboard/categories/`;

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
          data?.detail ||
          data?.non_field_errors?.[0] ||
          "Failed to save category.";

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
          ? "Category updated successfully."
          : "Category created successfully.",
      });
    } catch (error) {
      console.error("Submit error:", error);
      setMessage({
        type: "error",
        text: "Something went wrong while saving category.",
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
            Loading categories dashboard...
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
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedDeleteCategory?.name || "this category"}"?`}
      />

      <section className="mx-auto max-w-7xl">
        <DashboardTopbar onLogout={() => setLogoutOpen(true)} />

        <div className="mb-8 rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/80">
                Dashboard Categories
              </p>
              <h1 className="text-4xl font-bold md:text-5xl">Manage Categories</h1>
              <p className="mt-3 text-sm text-white/60">
                Add, edit, delete, and manage your categories from your custom dashboard.
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
              {editingId ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Category name"
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
                    ? "Update Category"
                    : "Create Category"}
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
            <h2 className="mb-5 text-2xl font-semibold">All Categories</h2>

            <div className="space-y-4">
              {categories.length === 0 ? (
                <p className="text-sm text-white/60">No categories found.</p>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-20 w-20 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-xs text-white/50">
                            No Image
                          </div>
                        )}

                        <div>
                          <p className="text-lg font-semibold text-white">{category.name}</p>
                          <p className="text-sm text-white/60">{category.slug}</p>
                          <p className="mt-1 text-sm text-white/70">
                            Products: {category.product_count ?? 0}
                          </p>
                          {category.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-white/60">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(category)}
                          className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/15"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => openDeleteModal(category)}
                          className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-400/15"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
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