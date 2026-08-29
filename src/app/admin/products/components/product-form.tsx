"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight, Plus, X, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Input, Textarea } from "@/components/ui/input";
import { CurrencyInput, WeightInput } from "@/components/ui/currency-input";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import {
  productSchema,
  type ProductFormInput,
  type ProductFormData,
} from "@/lib/schemas/product";
import { normalizeStoreSlug } from "@/lib/schemas/store";
import {
  formatProductImageMaxSize,
  PRODUCT_IMAGE_ACCEPT,
  PRODUCT_IMAGE_MAX_SIZE_BYTES,
} from "@/lib/product-image";

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

interface ProductFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<ProductFormData> & { images?: ProductImage[] };
  categories: CategoryOption[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  onAddImage?: (file: File) => Promise<void>;
  onRemoveImage?: (imageId: string) => Promise<void>;
  onReorderImages?: (images: { id: string; position: number }[]) => Promise<void>;
  serverError?: string | null;
  isSubmitting?: boolean;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--brand-black)]/40">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function ProductForm({
  mode,
  defaultValues,
  categories,
  onSubmit,
  onAddImage,
  onRemoveImage,
  onReorderImages,
  serverError,
  isSubmitting,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      categoryId: "",
      description: null,
      descriptionHtml: "",
      sku: "",
      barcode: "",
      brand: "",
      price: 0,
      compareAtPrice: null,
      stock: 0,
      minStock: null,
      weight: null,
      featured: false,
      active: true,
      seoTitle: "",
      seoDescription: "",
      ...defaultValues,
    },
  });

  const watchedName = watch("name");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === "edit");
  const [images, setImages] = useState<ProductImage[]>(defaultValues?.images || []);
  const [addingImage, setAddingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManuallyEdited && watchedName) {
      setValue("slug", normalizeStoreSlug(watchedName), { shouldValidate: true });
    }
  }, [watchedName, slugManuallyEdited, setValue]);

  useEffect(() => {
    setImages(defaultValues?.images || []);
  }, [defaultValues?.images]);

  async function handleAddImages(files: File[]) {
    if (!onAddImage || files.length === 0) return;

    const validFiles: File[] = [];

    for (const file of files) {
      if (file.size > PRODUCT_IMAGE_MAX_SIZE_BYTES) {
        toast.error(
          `"${file.name}" excede o limite de ${formatProductImageMaxSize()}.`
        );
        continue;
      }

      if (!PRODUCT_IMAGE_ACCEPT.split(",").includes(file.type)) {
        toast.error(`"${file.name}" não é uma imagem JPG, PNG ou WEBP válida.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      return;
    }

    setAddingImage(true);

    let successCount = 0;

    try {
      for (const file of validFiles) {
        try {
          await onAddImage(file);
          successCount += 1;
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : `Não foi possível enviar "${file.name}".`
          );
        }
      }

      if (successCount > 0) {
        toast.success(
          successCount === 1
            ? "Imagem adicionada com sucesso."
            : `${successCount} imagens adicionadas com sucesso.`
        );
      }
    } finally {
      setAddingImage(false);
    }
  }

  async function handleRemoveImage(imageId: string) {
    if (!onRemoveImage) return;
    await onRemoveImage(imageId);
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <Section title="Informações básicas">
        <Input
          label="Nome do produto"
          placeholder="Ex: Camiseta Básica Masculina"
          {...register("name")}
          error={errors.name?.message}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Input
              label="Slug"
              placeholder="camiseta-basica-masculina"
              {...register("slug")}
              error={errors.slug?.message}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                register("slug").onChange(e);
              }}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              URL do produto. Gerado automaticamente.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
              Categoria
            </label>
            <select
              {...register("categoryId")}
              className="flex h-10 w-full rounded-lg border border-[var(--brand-border)] bg-white px-3.5 text-sm text-[var(--brand-black)] transition-colors focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10"
            >
              <option value="">Sem categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1.5 text-xs text-[var(--brand-error)]">
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Marca"
            placeholder="Ex: Nike"
            {...register("brand")}
            error={errors.brand?.message}
          />
          <Input
            label="SKU"
            placeholder="CAM-BAS-M"
            {...register("sku")}
            error={errors.sku?.message}
          />
          <Input
            label="Código de barras"
            placeholder="7891234567890"
            {...register("barcode")}
            error={errors.barcode?.message}
          />
        </div>
      </Section>

      {/* Description */}
      <Section title="Descrição">
        <Controller
          name="descriptionHtml"
          control={control}
          render={({ field }) => (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
                Descrição do produto
              </label>
              <RichTextEditor
                value={field.value}
                onChange={(html, json) => {
                  setValue("descriptionHtml", html);
                  setValue("description", json);
                }}
              />
            </div>
          )}
        />
      </Section>

      {/* Images */}
      <Section title="Imagens">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-[var(--brand-border)]"
            >
              <Image
                src={img.url}
                alt={img.alt || "Produto"}
                fill
                className="object-cover"
                sizes="200px"
              />
              {idx === 0 && (
                <span className="absolute left-2 top-2 rounded-md bg-[var(--brand-black)] px-2 py-0.5 text-[10px] font-bold text-white">
                  Principal
                </span>
              )}
              {onRemoveImage && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img.id)}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-red-600 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {onAddImage ? (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={addingImage}
              className="flex items-center gap-2 rounded-lg bg-[var(--brand-black)] px-4 py-2.5 text-sm font-bold text-white transition-all hover:opacity-80 disabled:opacity-50"
            >
              {addingImage ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Upload size={16} />
                  <Plus size={16} />
                </>
              )}
              {addingImage ? "Enviando imagens..." : "Adicionar imagens"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept={PRODUCT_IMAGE_ACCEPT}
              multiple
              className="sr-only"
              disabled={addingImage}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                e.target.value = "";

                if (files.length > 0) {
                  void handleAddImages(files);
                }
              }}
            />
          </>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Envie uma ou mais imagens JPG, PNG ou WEBP de at&eacute; {formatProductImageMaxSize()}. A primeira imagem ser&aacute; a principal.
        </p>
      </Section>

      {/* Pricing */}
      <Section title="Preço">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                label="Preço (R$)"
                value={field.value}
                onChange={(v) => field.onChange(v ?? 0)}
                error={errors.price?.message}
              />
            )}
          />
          <Controller
            name="compareAtPrice"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                label="Preço anterior (R$)"
                value={field.value}
                onChange={(v) => field.onChange(v)}
                placeholder="Deixe vazio se não houver"
                error={errors.compareAtPrice?.message}
              />
            )}
          />
        </div>
      </Section>

      {/* Stock */}
      <Section title="Estoque">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Estoque atual"
            type="number"
            min="0"
            placeholder="0"
            {...register("stock")}
            error={errors.stock?.message}
          />
          <Input
            label="Estoque mínimo"
            type="number"
            min="0"
            placeholder="Opcional"
            helperText="Alerta quando estoque atingir este valor"
            {...register("minStock")}
            error={errors.minStock?.message}
          />
        </div>
      </Section>

      {/* Additional Info */}
      <Section title="Informações adicionais">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="weight"
            control={control}
            render={({ field }) => (
              <WeightInput
                label="Peso (kg)"
                value={field.value}
                onChange={(v) => field.onChange(v)}
                error={errors.weight?.message}
              />
            )}
          />
          <div className="flex items-end gap-6">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                {...register("featured")}
                className="size-4 rounded accent-[var(--brand-yellow)]"
              />
              <span className="text-sm font-medium text-[var(--brand-black)]">
                Produto em destaque
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                {...register("active")}
                className="size-4 rounded accent-[var(--brand-yellow)]"
              />
              <span className="text-sm font-medium text-[var(--brand-black)]">
                Produto ativo
              </span>
            </label>
          </div>
        </div>
      </Section>

      {/* SEO */}
      <Section title="SEO">
        <Input
          label="Título SEO"
          placeholder="Ex: Camiseta Básica Masculina - Algodão"
          {...register("seoTitle")}
          error={errors.seoTitle?.message}
          helperText="Máximo 70 caracteres. Se vazio, usa o nome do produto."
        />
        <div>
          <Textarea
            label="Descrição SEO"
            placeholder="Descrição para mecanismos de busca"
            rows={2}
            {...register("seoDescription")}
            error={errors.seoDescription?.message}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Máximo 160 caracteres. Se vazio, usa a descrição do produto.
          </p>
        </div>
      </Section>

      {/* Error */}
      {serverError && (
        <div className="rounded-lg bg-[var(--brand-error-light)] px-4 py-3 text-sm font-medium text-[var(--brand-error)]">
          {serverError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-[var(--brand-black)] transition-all hover:shadow-md disabled:opacity-60 sm:w-auto sm:px-8"
        style={{ backgroundColor: "var(--brand-yellow)" }}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {mode === "create" ? "Criando..." : "Salvando..."}
          </>
        ) : (
          <>
            {mode === "create" ? "Criar produto" : "Salvar alterações"}
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
