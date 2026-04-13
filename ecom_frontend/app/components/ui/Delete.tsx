"use client";

interface DeleteProps {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function Delete({
  open,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  onClose,
  onConfirm,
  loading = false,
}: DeleteProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0b1120]/95 p-6 text-white shadow-2xl backdrop-blur-2xl">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-red-300/80">
          Confirm Delete
        </p>

        <h2 className="text-2xl font-bold">{title}</h2>

        <p className="mt-3 text-sm leading-6 text-white/65">{message}</p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/15 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}