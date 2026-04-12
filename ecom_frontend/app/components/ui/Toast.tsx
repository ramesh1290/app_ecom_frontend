"use client";

import { AnimatePresence, motion } from "framer-motion";

type ToastType = "success" | "error";

interface ToastProps {
  show: boolean;
  message: string;
  type: ToastType;
}

export default function Toast({ show, message, type }: ToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className={`fixed right-5 top-5 z-[999] min-w-[280px] max-w-sm rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl ${
            type === "success"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
              : "border-red-400/20 bg-red-400/10 text-red-200"
          }`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}