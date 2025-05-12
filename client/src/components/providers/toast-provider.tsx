"use client";

import { Toaster } from "sonner";

export function ToastProvider() {  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "dark-theme",
        style: {
          background: "rgba(33, 36, 46, 0.95)",
          color: "#fff",
          border: "1px solid rgba(86, 96, 133, 0.5)",
          backdropFilter: "blur(10px)",
        },
        classNames: {
          success: "border-l-4 border-l-[#10b981]",
          error: "border-l-4 border-l-[#ef4444]",
          warning: "border-l-4 border-l-[#f59e0b]",
          info: "border-l-4 border-l-[#3b82f6]",
        }
      }}
    />
  );
}
