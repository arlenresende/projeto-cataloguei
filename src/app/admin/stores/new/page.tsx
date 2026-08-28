"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { StoreForm } from "@/components/admin/StoreForm";
import type { StoreFormData } from "@/lib/schemas/store";

export default function NewStorePage() {
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
        return;
      }

      router.refresh();
      router.push("/admin/stores");
    } catch {
      setServerError("Erro de conexão. Tente novamente.");
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
