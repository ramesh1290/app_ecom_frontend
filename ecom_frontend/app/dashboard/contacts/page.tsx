"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logout from "../../components/ui/Logout";
import Delete from "../../components/ui/Delete";
import DashboardTopbar from "../../components/dashboard/DashboardTopbar";

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
}

interface StoredUser {
  firstName?: string;
  email?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export default function DashboardContactsPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const [logoutOpen, setLogoutOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [allowed, setAllowed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);


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
      const parsed: StoredUser = JSON.parse(user);
      const isAdmin = !!parsed.is_staff || !!parsed.is_superuser;

      if (!isAdmin) {
        router.replace("/");
        return;
      }

      // setAdminName(parsed.firstName || parsed.email || "Admin");
      setAllowed(true);
      setAuthChecked(true);
    } catch {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [message]);

  const fetchContacts = async () => {
    const token = localStorage.getItem("access");

    if (!token || !apiBaseUrl) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/api/dashboard/contacts/`, {
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
          text: "Failed to load contact messages.",
        });
        return;
      }

      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Something went wrong while loading contacts.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allowed) {
      fetchContacts();
    }
  }, [allowed]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    router.replace("/");
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("access");
    if (!selected || !apiBaseUrl) return;

    try {
      setDeleteLoading(true);

      const res = await fetch(
        `${apiBaseUrl}/api/dashboard/contacts/${selected.id}/`,
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
          text: "Failed to delete contact message.",
        });
        return;
      }

      setContacts((prev) => prev.filter((c) => c.id !== selected.id));
      setDeleteOpen(false);
      setSelected(null);
      setMessage({
        type: "success",
        text: "Contact message deleted successfully.",
      });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Something went wrong while deleting contact message.",
      });
    } finally {
      setDeleteLoading(false);
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
          <DashboardTopbar
           
            onLogout={() => setLogoutOpen(true)}
          />

          <div className="rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-8 shadow-2xl backdrop-blur-2xl">
            Loading contact messages...
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
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Contact"
        message={`Are you sure you want to delete the message from "${selected?.first_name || ""} ${selected?.last_name || ""}"?`}
      
      />

      <section className="mx-auto max-w-7xl">
        <DashboardTopbar
         
          onLogout={() => setLogoutOpen(true)}
        />

        <div className="mb-8 rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/80">
                Dashboard Contacts
              </p>
              <h1 className="text-4xl font-bold md:text-5xl">Manage Contact Messages</h1>
              <p className="mt-3 text-sm text-white/60">
                Review and manage messages submitted from your contact form.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              Total Messages: {contacts.length}
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

        {contacts.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-[#0b1120]/80 p-10 text-center shadow-2xl backdrop-blur-2xl">
            <h2 className="text-2xl font-semibold text-white">No messages yet</h2>
            <p className="mt-3 text-sm text-white/60">
              Contact form messages will appear here when users submit them.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="rounded-[28px] border border-white/10 bg-[#0b1120]/80 p-6 shadow-2xl backdrop-blur-2xl"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/70">
                      Contact Message
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-white">
                      {c.first_name} {c.last_name}
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  {/* <p className="text-white/85">
                    <span className="font-semibold text-white">Name:</span>{" "}
                    {c.first_name} {c.last_name}
                  </p> */}

                  <p className="text-white/85 break-words">
                    <span className="font-semibold text-white">Email:</span>{" "}
                    {c.email}
                  </p>

                  <p className="text-white/85 break-words">
                    <span className="font-semibold text-white">Subject:</span>{" "}
                    {c.subject}
                  </p>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="mb-2 font-semibold text-white">Message:</p>
                    <p className="whitespace-pre-line text-sm leading-6 text-white/70">
                      {c.message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelected(c);
                    setDeleteOpen(true);
                  }}
                  className="mt-5 w-full rounded-2xl border border-red-400/20 bg-red-400/10 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/15"
                >
                  Delete Message
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}