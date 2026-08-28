"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { HeroForm } from "../../components/hero-form";
import type { StoreHeroFormData } from "@/lib/schemas/store-hero";

export default function EditHeroPage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;
  const heroId = params.heroId as string;
  const [hero, setHero] = useState<StoreHeroFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/stores/${storeId}/heroes`);
        const data = await res.json();
        const found = data.heroes?.find((h: any) => h.id === heroId);
        if (found) {
          setHero({
            title: found.title,
            description: found.description || "",
            image: found.image || "",
            bgColor: found.bgColor || "",
            textColor: found.textColor || "",
            alignment: found.alignment || "CENTER",
            buttonText: found.buttonText || "",
            buttonUrl: found.buttonUrl || "",
            position: found.position,
            isActive: found.isActive,
          });
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [storeId, heroId]);

  async function handleSubmit(data: StoreHeroFormData) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/stores/${storeId}/heroes/${heroId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Erro ao atualizar o hero.");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--brand-yellow)] border-t-transparent" />
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold text-[var(--brand-black)]">Hero não encontrado</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Editar hero"
        subtitle="Atualize as informações do hero"
      />
      <div className="rounded-2xl border border-[var(--brand-border)] bg-white p-6 md:p-8">
        <HeroForm
          mode="edit"
          defaultValues={hero}
          onSubmit={handleSubmit}
          serverError={serverError}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
