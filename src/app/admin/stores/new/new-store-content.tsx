"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { StoreForm } from "@/components/admin/StoreForm";
import { trackGoogleEvent } from "@/lib/analytics/google";
import type { StoreFormData } from "@/lib/schemas/store";

export function NewStoreContent() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data: StoreFormData) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Erro ao criar a loja.");
        trackGoogleEvent("store_create_error", {
          source: "admin_store_new",
          reason: result.error || "api_error",
        });
        return;
      }

      trackGoogleEvent("store_created", {
        source: "admin_store_new",
        store_slug: result.store?.slug || data.slug,
      });
      router.refresh();
      router.push("/admin/stores");
    } catch {
      setServerError("Erro de conexão. Tente novamente.");
      trackGoogleEvent("store_create_error", {
        source: "admin_store_new",
        reason: "network_error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Nova loja"
        subtitle="Preencha as informações para criar sua loja"
      />
      <div className="rounded-2xl border border-[var(--brand-border)] bg-white p-6 md:p-8">
        <StoreForm
          mode="create"
          onSubmit={handleSubmit}
          serverError={serverError}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
