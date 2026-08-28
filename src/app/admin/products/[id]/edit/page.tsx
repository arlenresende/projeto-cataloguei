"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ProductForm } from "../../components/product-form";
import type { ProductFormData } from "@/lib/schemas/product";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  position: number;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<(ProductFormData & { images?: ProductImage[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch("/api/categories"),
        ]);

        const productData = await productRes.json();
        const categoriesData = await categoriesRes.json();

        if (productData.product) {
          const p = productData.product;
          setImages(p.images || []);
          setProduct({
            name: p.name,
            slug: p.slug,
            categoryId: p.categoryId || "",
            description: p.description,
            descriptionHtml: p.descriptionHtml || "",
            sku: p.sku || "",
            barcode: p.barcode || "",
            brand: p.brand || "",
            price: Number(p.price),
            compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
            stock: p.stock,
            minStock: p.minStock,
            weight: p.weight ? Number(p.weight) : null,
            featured: p.featured,
            active: p.active,
            seoTitle: p.seoTitle || "",
            seoDescription: p.seoDescription || "",
            images: p.images || [],
          });
        }

        if (categoriesData.categories) {
          const list = categoriesData.categories as { id: string; name: string }[];
          setCategories(list.map((c) => ({ id: c.id, name: c.name })));
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(data: ProductFormData) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Erro ao atualizar o produto.");
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

  async function handleAddImage(url: string) {
    const res = await fetch(`/api/products/${id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (data.image) {
      setImages((prev) => [...prev, data.image]);
    }
  }

  async function handleRemoveImage(imageId: string) {
    await fetch(`/api/products/${id}/images/${imageId}`, {
      method: "DELETE",
    });
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  async function handleReorderImages(reordered: { id: string; position: number }[]) {
    await fetch(`/api/products/${id}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: reordered }),
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--brand-yellow)] border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold text-[var(--brand-black)]">
          Produto não encontrado
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Editar produto"
        subtitle="Atualize as informações do produto"
      />
      <div className="max-w-3xl rounded-2xl border border-[var(--brand-border)] bg-white p-6 md:p-8">
        <ProductForm
          mode="edit"
          defaultValues={{ ...product, images }}
          categories={categories}
          onSubmit={handleSubmit}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
          onReorderImages={handleReorderImages}
          serverError={serverError}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
