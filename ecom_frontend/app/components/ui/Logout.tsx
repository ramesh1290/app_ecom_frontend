"use client";

import { AnimatePresence, motion } from "framer-motion";

interface LogoutProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function Logout({ open, onClose, onConfirm }: LogoutProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 top-1/2 z-[1000] w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[32px] border border-white/10 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-2xl "
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-2xl text-red-200">
              ⎋
            </div>

            <h2 className="text-2xl font-bold">Logout</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Are you sure you want to logout?
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={onClose}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/15 cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}