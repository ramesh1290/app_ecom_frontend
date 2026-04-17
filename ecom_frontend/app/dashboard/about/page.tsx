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
  const [isSavingUI, setIsSavingUI] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const [logoutOpen, setLogoutOpen] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // FETCH
  const fetchAbout = async () => {
    try {
      const res = await fetch(`${API}/api/about/`);
      const json = await res.json();

      const about = json?.[0];
      setData(about);
      setForm(about);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // INPUT CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!form) return;

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // IMAGE
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // SAVE
  const handleSave = async () => {
    if (!form) return;

    try {
      setIsSavingUI(true);
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

      setImageFile(null);
      setImagePreview(null);

      // Saving → Saved → Fade → Back to Edit
      setTimeout(() => {
        setSaveStatus("saved");

        setTimeout(() => {
          setSaveStatus("idle");
          setIsSavingUI(false);
          setEditMode(false);
        }, 1500);
      }, 800);

    } catch (err) {
      console.error(err);
      setIsSavingUI(false);
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
    <main className="min-h-screen bg-[#020617] text-white px-6 py-10">

      <Logout
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />

      <section className="mx-auto max-w-6xl">

        <DashboardTopbar
          adminName="Admin"
          onLogout={() => setLogoutOpen(true)}
        />

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">

          <div>
            <h1 className="text-3xl font-bold">About Page</h1>
            <p className="text-white/50 text-sm mt-1">
              Manage your brand story
            </p>
          </div>

          {/*  BUTTON MORPH UI */}
          <div className="flex items-center gap-3">

            {isSavingUI ? (
              <div className="px-6 py-2 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-sm animate-pulse">
                {saveStatus === "saved" ? "✅ Saved" : "⏳ Saving..."}
              </div>
            ) : (
              <>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                  >
                    Edit
                  </button>
                )}

                {editMode && (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-5 py-2 rounded-xl border border-white/10 bg-white/5"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSave}
                      className="px-5 py-2 rounded-xl bg-cyan-500/20 text-cyan-200"
                    >
                      Save
                    </button>
                  </>
                )}
              </>
            )}

          </div>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 disabled:opacity-60"
            />

            <textarea
              name="description_1"
              value={form.description_1}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 disabled:opacity-60"
            />

            <textarea
              name="description_2"
              value={form.description_2}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 disabled:opacity-60"
            />

            <input
              name="mission_title"
              value={form.mission_title}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 disabled:opacity-60"
            />

            <textarea
              name="mission_desc"
              value={form.mission_desc}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 disabled:opacity-60"
            />

            <input
              name="vision_title"
              value={form.vision_title}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 disabled:opacity-60"
            />

            <textarea
              name="vision_desc"
              value={form.vision_desc}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 disabled:opacity-60"
            />

            {/* IMAGE */}
            <div className="pt-4">
              <input
                type="file"
                onChange={handleImageChange}
                disabled={!editMode}
              />

              {(imagePreview || data.image) && (
                <img
                  src={imagePreview || data.image!}
                  className="mt-3 h-40 w-full object-cover rounded-xl"
                />
              )}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 h-[480px] relative">

            {(imagePreview || data.image) && (
              <Image
                src={imagePreview || data.image!}
                alt="about"
                fill
                className="object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

        </div>

      </section>
    </main>
  );
}