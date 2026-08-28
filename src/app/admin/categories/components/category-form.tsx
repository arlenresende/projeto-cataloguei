"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Input, Textarea } from "@/components/ui/input";
import {
  categorySchema,
  type CategoryFormInput,
  type CategoryFormData,
  CATEGORY_SUGGESTIONS,
} from "@/lib/schemas/category";
import { normalizeStoreSlug } from "@/lib/schemas/store";

interface CategoryFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  serverError?: string | null;
  isSubmitting?: boolean;
}

export function CategoryForm({
  mode,
  defaultValues,
  onSubmit,
  serverError,
  isSubmitting,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormInput, unknown, CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      isActive: true,
      ...defaultValues,
    },
  });

  const watchedName = watch("name");
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    mode === "edit"
  );

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManuallyEdited && watchedName) {
      setValue("slug", normalizeStoreSlug(watchedName), {
        shouldValidate: true,
      });
    }
  }, [watchedName, slugManuallyEdited, setValue]);

  function handleSuggestionChange(value: string) {
    setSelectedSuggestion(value);
    if (value && value !== "Outro") {
      setValue("name", value, { shouldValidate: true });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Suggestion selector — only in create mode */}
      {mode === "create" && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
            Categoria sugerida
          </label>
          <select
            value={selectedSuggestion}
            onChange={(e) => handleSuggestionChange(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-[var(--brand-border)] bg-white px-3.5 text-sm text-[var(--brand-black)] transition-colors focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10"
          >
            <option value="">Selecione uma sugestão</option>
            {CATEGORY_SUGGESTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      <Input
        label="Nome"
        placeholder="Ex: Roupas Femininas"
        {...register("name")}
        error={errors.name?.message}
      />

      <div>
        <Input
          label="Slug"
          placeholder="roupas-femininas"
          {...register("slug")}
          error={errors.slug?.message}
          onChange={(e) => {
            setSlugManuallyEdited(true);
            register("slug").onChange(e);
          }}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          URL da categoria. Gerado automaticamente a partir do nome.
        </p>
      </div>

      <Textarea
        label="Descrição"
        placeholder="Descrição opcional da categoria"
        rows={3}
        {...register("description")}
        error={errors.description?.message}
      />

      {mode === "edit" && (
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              {...register("isActive")}
              className="size-4 rounded accent-[var(--brand-yellow)]"
            />
            <span className="text-sm font-medium text-[var(--brand-black)]">
              Categoria ativa
            </span>
          </label>
        </div>
      )}

      {serverError && (
        <div className="rounded-lg bg-[var(--brand-error-light)] px-4 py-3 text-sm font-medium text-[var(--brand-error)]">
          {serverError}
        </div>
      )}

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
            {mode === "create" ? "Criar categoria" : "Salvar alterações"}
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
