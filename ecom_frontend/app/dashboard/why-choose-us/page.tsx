"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardTopbar from "@/app/components/dashboard/DashboardTopbar";
import Logout from "@/app/components/ui/Logout";
import Delete from "@/app/components/ui/Delete";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ---------------- TYPES ---------------- */
interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

/* ---------------- SORTABLE CARD ---------------- */
function SortableCard({ feature, onEdit, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: feature.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-3xl border border-white/10 bg-white/5 p-6"
    >
      <div {...attributes} {...listeners} className="cursor-grab text-white/40">
        ⠿ Drag
      </div>

      {/* ICON (REAL EMOJI FROM BACKEND) */}
      <div className="mt-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
        {feature.icon}
      </div>

      <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
      <p className="mt-2 text-sm text-white/60">{feature.description}</p>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => onEdit(feature)}
          className="rounded-xl bg-cyan-500/10 px-3 py-2 text-xs text-cyan-200"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(feature)}
          className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* ---------------- EDIT MODAL ---------------- */
function EditModal({ open, feature, onClose, onSave }: any) {
  const [form, setForm] = useState(feature);

  useEffect(() => {
    setForm(feature);
  }, [feature]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0b172a] p-6 text-white">

        <h2 className="text-xl font-bold">Edit Feature</h2>

        <input
          className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          value={form?.title || ""}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          placeholder="Title"
        />

        <textarea
          className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          value={form?.description || ""}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          placeholder="Description"
        />

        <input
          className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xl"
          value={form?.icon || ""}
          onChange={(e) =>
            setForm({ ...form, icon: e.target.value })
          }
          placeholder="Icon (⚡ 🔒 ✦ 🚚)"
        />

        <div className="mt-4 text-2xl">{form?.icon}</div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2">
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            className="rounded-xl bg-cyan-500/20 px-4 py-2 text-cyan-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- CREATE MODAL ---------------- */
function CreateModal({ open, form, setForm, onClose, onSave }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0b172a] p-6 text-white">

        <h2 className="text-xl font-bold">Add Feature</h2>

        <input
          className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xl"
          placeholder="Icon (⚡ 🔒 ✦ 🚚)"
          value={form.icon}
          onChange={(e) =>
            setForm({ ...form, icon: e.target.value })
          }
        />

        <div className="mt-4 text-2xl">{form.icon}</div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2">
            Cancel
          </button>

          <button
            onClick={onSave}
            className="rounded-xl bg-cyan-500/20 px-4 py-2 text-cyan-200"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- MAIN PAGE ---------------- */
export default function WhyChooseUsDashboard() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  const [logoutOpen, setLogoutOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    icon: "",
  });

  /* AUTH */
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) router.replace("/");
  }, [router]);

  /* FETCH */
  const fetchFeatures = async () => {
    const res = await fetch(`${API_BASE}/api/why-choose-us/`);
    const data = await res.json();
    setFeatures(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  /* CREATE */
  const handleCreate = async () => {
    const res = await fetch(`${API_BASE}/api/why-choose-us/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });

    const data = await res.json();
    setFeatures((prev) => [...prev, data]);

    setCreateForm({ title: "", description: "", icon: "" });
    setCreateOpen(false);
  };

  /* EDIT */
  const handleEdit = (item: Feature) => {
    setSelected(item);
    setEditOpen(true);
  };

  const handleSave = async (updated: Feature) => {
    const res = await fetch(
      `${API_BASE}/api/why-choose-us/${updated.id}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      }
    );

    const data = await res.json();

    setFeatures((prev) =>
      prev.map((f) => (f.id === updated.id ? data : f))
    );

    setEditOpen(false);
  };

  /* DELETE */
  const handleDelete = (item: Feature) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    await fetch(`${API_BASE}/api/why-choose-us/${deleteItem.id}/`, {
      method: "DELETE",
    });

    setFeatures((prev) =>
      prev.filter((f) => f.id !== deleteItem.id)
    );

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  /* DRAG */
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = features.findIndex((f) => f.id === active.id);
    const newIndex = features.findIndex((f) => f.id === over.id);

    const newOrder = arrayMove(features, oldIndex, newIndex);

    setFeatures(newOrder);

    fetch(`${API_BASE}/api/why-choose-us/reorder/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: newOrder.map((f) => f.id),
      }),
    });
  };

  /* LOGOUT */
  const handleLogout = () => {
    localStorage.clear();
    router.replace("/");
  };

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-10 text-white">
      <section className="mx-auto max-w-7xl">

        <DashboardTopbar
          adminName="Admin"
          onLogout={() => setLogoutOpen(true)}
        />

        {/* CREATE BUTTON */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-2xl bg-cyan-500/20 px-5 py-3 text-cyan-200"
          >
            + Add Feature
          </button>
        </div>

        {/* GRID */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={features.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {features.map((f) => (
                <SortableCard
                  key={f.id}
                  feature={f}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* MODALS */}
        <Logout
          open={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          onConfirm={handleLogout}
        />

        <EditModal
          open={editOpen}
          feature={selected}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
        />

        <CreateModal
          open={createOpen}
          form={createForm}
          setForm={setCreateForm}
          onClose={() => setCreateOpen(false)}
          onSave={handleCreate}
        />

        <Delete
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={confirmDelete}
        />

      </section>
    </main>
  );
}