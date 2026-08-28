"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { StoreForm } from "@/components/admin/StoreForm";
import type { StoreFormData } from "@/lib/schemas/store";

export default function EditStorePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [store, setStore] = useState<StoreFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/stores/${id}`);
        const data = await res.json();
        if (data.store) {
          setStore({
            name: data.store.name,
            slug: data.store.slug,
            description: data.store.description || "",
            address: data.store.address || "",
            city: data.store.city || "",
            state: data.store.state || "",
            postalCode: data.store.postalCode || "",
            country: data.store.country || "",
            email: data.store.email || "",
            logo: data.store.logo || "",
            websiteUrl: data.store.websiteUrl || "",
            whatsappUrl: data.store.whatsappUrl || "",
            instagramUrl: data.store.instagramUrl || "",
            facebookUrl: data.store.facebookUrl || "",
            phoneNumber: data.store.phoneNumber || "",
            cellPhone: data.store.cellPhone || "",
            themeStore: data.store.themeStore || "DEFAULT",
            isActive: data.store.isActive,
          });
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(data: StoreFormData) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/stores/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Erro ao atualizar a loja.");
        return;
      }

      router.push(`/admin/stores/${id}`);
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

  if (!store) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold text-[var(--brand-black)]">
          Loja não encontrada
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Editar loja"
        subtitle="Atualize as informações da sua loja"
      />
      <div className="rounded-2xl border border-[var(--brand-border)] bg-white p-6 md:p-8">
        <StoreForm
          mode="edit"
          defaultValues={store}
          onSubmit={handleSubmit}
          serverError={serverError}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
