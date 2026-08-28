"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight } from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import { storeHeroSchema, type StoreHeroFormData } from "@/lib/schemas/store-hero";

interface HeroFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<StoreHeroFormData>;
  onSubmit: (data: StoreHeroFormData) => Promise<void>;
  serverError?: string | null;
  isSubmitting?: boolean;
}

export function HeroForm({
  mode,
  defaultValues,
  onSubmit,
  serverError,
  isSubmitting,
}: HeroFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StoreHeroFormData>({
    resolver: zodResolver(storeHeroSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      bgColor: "",
      buttonText: "",
      buttonUrl: "",
      position: 0,
      isActive: true,
      ...defaultValues,
    },
  });

  const watchedValues = watch();

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Título"
          placeholder="Ex: Promoção de verão"
          {...register("title")}
          error={errors.title?.message}
        />

        <Textarea
          label="Descrição"
          placeholder="Texto complementar do hero"
          rows={3}
          {...register("description")}
          error={errors.description?.message}
        />

        <Input
          label="Imagem (URL)"
          placeholder="https://..."
          {...register("image")}
          error={errors.image?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Cor de fundo"
            placeholder="#FFD400"
            {...register("bgColor")}
            error={errors.bgColor?.message}
          />
          <Input
            label="Posição"
            type="number"
            placeholder="0"
            {...register("position")}
            error={errors.position?.message}
          />
        </div>

        <Input
          label="Texto do botão"
          placeholder="Ex: Ver produtos"
          {...register("buttonText")}
          error={errors.buttonText?.message}
        />

        <Input
          label="URL do botão"
          placeholder="/produtos ou https://..."
          {...register("buttonUrl")}
          error={errors.buttonUrl?.message}
        />

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            {...register("isActive")}
            className="size-4 rounded accent-[var(--brand-yellow)]"
          />
          <span className="text-sm font-medium text-[var(--brand-black)]">
            Hero ativo
          </span>
        </label>

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
              {mode === "create" ? "Criar hero" : "Salvar alterações"}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Preview */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--brand-black)]/40">
          Preview
        </p>
        <div
          className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-[var(--brand-border)] p-8 text-center"
          style={{
            backgroundColor: watchedValues.bgColor || "var(--brand-tertiary)",
          }}
        >
          {watchedValues.title ? (
            <>
              <h3 className="text-xl font-extrabold text-[var(--brand-black)]">
                {watchedValues.title}
              </h3>
              {watchedValues.description && (
                <p className="mt-2 max-w-sm text-sm text-[var(--brand-black)]/60">
                  {watchedValues.description}
                </p>
              )}
              {watchedValues.buttonText && (
                <div
                  className="mt-4 inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold"
                  style={{
                    backgroundColor: "var(--brand-yellow)",
                    color: "var(--brand-black)",
                  }}
                >
                  {watchedValues.buttonText}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-[var(--brand-black)]/30">
              Preencha o título para ver o preview
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
