"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateStoreDialog } from "./CreateStoreDialog";

export function OnboardingGate() {
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkStore() {
      try {
        const response = await fetch("/api/stores/check");

        if (!response.ok) {
          throw new Error("Falha ao verificar a loja");
        }

        const data = await response.json();
        setHasStore(data.hasStore);
      } catch {
        setHasStore(true); // Don't block on error
      }
    }
    checkStore();
  }, []);

  if (hasStore === null || hasStore === true) {
    return null;
  }

  return (
    <CreateStoreDialog
      open={true}
      onStoreCreated={() => {
        setHasStore(true);
        router.refresh();
      }}
    />
  );
}
