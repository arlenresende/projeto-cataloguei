"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { CategoryForm } from "../../components/category-form";
import type { CategoryFormData } from "@/lib/schemas/category";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [category, setCategory] = useState<CategoryFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/categories/${id}`);
        const data = await res.json();
        if (data.category) {
          setCategory({
            name: data.category.name,
            description: data.category.description || "",
            slug: data.category.slug,
            isActive: data.category.isActive,
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

  async function handleSubmit(data: CategoryFormData) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Erro ao atualizar a categoria.");
        return;
      }

      router.push("/admin/categories");
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

  if (!category) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold text-[var(--brand-black)]">
          Categoria não encontrada
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Editar categoria"
        subtitle="Atualize as informações da categoria"
      />
      <div className="max-w-2xl rounded-2xl border border-[var(--brand-border)] bg-white p-6 md:p-8">
        <CategoryForm
          mode="edit"
          defaultValues={category}
          onSubmit={handleSubmit}
          serverError={serverError}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
