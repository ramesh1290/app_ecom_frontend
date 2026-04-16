"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DashboardTopbar from "@/app/components/dashboard/DashboardTopbar";
import Logout from "@/app/components/ui/Logout";

interface About {
  id: number;
  title: string;
  description_1: string;
  description_2: string;
  mission_title: string;
  mission_desc: string;
  vision_title: string;
  vision_desc: string;
  image: string | null;
}

type SaveStatus = "idle" | "saving" | "saved";

export default function AboutDashboard() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [data, setData] = useState<About | null>(null);
  const [form, setForm] = useState<About | null>(null);

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [logoutOpen, setLogoutOpen] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch(`${API}/api/about/`);
      const json = await res.json();

      setData(json[0]);
      setForm(json[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!form) return;

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form) return;

    try {
      setSaveStatus("saving");

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description_1", form.description_1 || "");
      formData.append("description_2", form.description_2 || "");
      formData.append("mission_title", form.mission_title);
      formData.append("mission_desc", form.mission_desc);
      formData.append("vision_title", form.vision_title);
      formData.append("vision_desc", form.vision_desc);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`${API}/api/about/${form.id}/`, {
        method: "PATCH",
        body: formData,
      });

      const updated = await res.json();

      setData(updated);
      setForm(updated);

      setEditMode(false);
      setImageFile(null);
      setImagePreview(null);

      setSaveStatus("saved");

      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus("idle");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!data || !form) return null;

  return (
    <main className="min-h-screen bg-[#020617] text-white px-4 py-10">

      <Logout
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />

      <section className="mx-auto max-w-7xl">

        <DashboardTopbar
          adminName="Admin"
          onLogout={() => setLogoutOpen(true)}
        />

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold">About Page</h1>
            <p className="text-white/60 text-sm mt-1">
              Manage your brand story content
            </p>
          </div>

          <div className="flex gap-3 items-center">

            {/* SAVE STATUS */}
            {saveStatus !== "idle" && (
              <div className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5">
                {saveStatus === "saving" && "⏳ Saving..."}
                {saveStatus === "saved" && "✅ Saved"}
              </div>
            )}

            <button
              onClick={() => setEditMode(!editMode)}
              className="px-5 py-2 rounded-2xl border border-white/10 bg-white/5"
            >
              {editMode ? "Cancel" : "Edit"}
            </button>

            {editMode && (
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-2xl bg-cyan-500/20 text-cyan-200"
              >
                Save
              </button>
            )}
          </div>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* FORM */}
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 space-y-4">

            {(
              [
                "title",
                "description_1",
                "description_2",
                "mission_title",
                "mission_desc",
                "vision_title",
                "vision_desc",
              ] as const
            ).map((field) => {
              const isTextArea =
                field.includes("description") || field.includes("desc");

              return isTextArea ? (
                <textarea
                  key={field}
                  name={field}
                  value={(form as any)[field] || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full p-3 rounded-xl border border-white/10 transition
                    ${
                      editMode
                        ? "bg-black/30"
                        : "bg-black/10 opacity-70 cursor-not-allowed"
                    }
                  `}
                />
              ) : (
                <input
                  key={field}
                  name={field}
                  value={(form as any)[field] || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full p-3 rounded-xl border border-white/10 transition
                    ${
                      editMode
                        ? "bg-black/30"
                        : "bg-black/10 opacity-70 cursor-not-allowed"
                    }
                  `}
                />
              );
            })}

            {/* IMAGE */}
            <div className="pt-4">
              <label className="text-sm text-white/60">
                About Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={!editMode}
                className="mt-2 w-full"
              />

              {(imagePreview || data.image) && (
                <img
                  src={imagePreview || data.image!}
                  className="mt-3 h-40 w-full object-cover rounded-xl"
                />
              )}
            </div>
          </div>

          {/* IMAGE PREVIEW */}
          <div className="rounded-[32px] overflow-hidden border border-white/10 bg-white/5 h-[480px] relative">

            {(imagePreview || data.image) && (
              <Image
                src={imagePreview || data.image!}
                alt="about"
                fill
                className="object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          </div>

        </div>
      </section>
    </main>
  );
}