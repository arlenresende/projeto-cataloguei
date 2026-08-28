"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { CategoryForm } from "../components/category-form";
import type { CategoryFormData } from "@/lib/schemas/category";

export default function NewCategoryPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data: CategoryFormData) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Erro ao criar a categoria.");
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

  return (
    <div>
      <PageHeader
        title="Nova categoria"
        subtitle="Crie uma categoria para organizar os produtos da sua loja"
      />
      <div className="max-w-2xl rounded-2xl border border-[var(--brand-border)] bg-white p-6 md:p-8">
        <CategoryForm
          mode="create"
          onSubmit={handleSubmit}
          serverError={serverError}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
