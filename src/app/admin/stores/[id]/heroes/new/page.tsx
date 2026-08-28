"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { HeroForm } from "../components/hero-form";
import type { StoreHeroFormData } from "@/lib/schemas/store-hero";

export default function NewHeroPage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data: StoreHeroFormData) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/stores/${storeId}/heroes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Erro ao criar o hero.");
        return;
      }

      router.push(`/admin/stores/${storeId}/heroes`);
      router.refresh();
    } catch {
      setServerError("Erro de conexão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Novo hero"
        subtitle="Crie um hero para destacar na sua loja"
      />
      <div className="rounded-2xl border border-[var(--brand-border)] bg-white p-6 md:p-8">
        <HeroForm
          mode="create"
          onSubmit={handleSubmit}
          serverError={serverError}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
