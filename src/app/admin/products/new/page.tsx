"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ProductForm } from "../components/product-form";
import type { ProductFormData } from "@/lib/schemas/product";

interface CategoryOption {
  id: string;
  name: string;
}

interface CategoryApi {
  id: string;
  name: string;
  isActive?: boolean;
}

export default function NewProductPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const data: { categories?: CategoryApi[] } = await res.json();
        if (data.categories) {
          setCategories(
            data.categories
              .filter((c) => c.isActive ?? true)
              .map((c) => ({ id: c.id, name: c.name }))
          );
        }
      } catch {
        // silent
      }
    }
    loadCategories();
  }, []);

  async function handleSubmit(data: ProductFormData) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Erro ao criar o produto.");
        return;
      }

      router.push("/admin/products");
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
        title="Novo produto"
        subtitle="Adicione um produto à sua loja"
      />
      <div className="max-w-3xl rounded-2xl border border-[var(--brand-border)] bg-white p-6 md:p-8">
        <ProductForm
          mode="create"
          categories={categories}
          onSubmit={handleSubmit}
          serverError={serverError}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
