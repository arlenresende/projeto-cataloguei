"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "rounded-xl border border-[var(--brand-border)]",
          title: "text-sm font-semibold",
          description: "text-sm",
        },
      }}
    />
  );
}
