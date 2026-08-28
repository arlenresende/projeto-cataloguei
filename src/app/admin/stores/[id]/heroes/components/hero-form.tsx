"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight } from "lucide-react";
import { ChromePicker } from "react-color";
import { useState, useRef, useEffect } from "react";
import { Input, Textarea } from "@/components/ui/input";
import { storeHeroSchema, type StoreHeroFormData } from "@/lib/schemas/store-hero";

const ALIGNMENT_OPTIONS = [
  { value: "LEFT", label: "Esquerda" },
  { value: "CENTER", label: "Centro" },
  { value: "RIGHT", label: "Direita" },
] as const;

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
    control,
    setValue,
    formState: { errors },
  } = useForm<StoreHeroFormData>({
    resolver: zodResolver(storeHeroSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      bgColor: "",
      alignment: "CENTER",
      buttonText: "",
      buttonUrl: "",
      position: 0,
      isActive: true,
      ...defaultValues,
    },
  });

  const watchedValues = watch();
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showTextPicker, setShowTextPicker] = useState(false);
  const bgPickerRef = useRef<HTMLDivElement>(null);
  const textPickerRef = useRef<HTMLDivElement>(null);

  // Close color pickers on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bgPickerRef.current && !bgPickerRef.current.contains(e.target as Node)) {
        setShowBgPicker(false);
      }
      if (textPickerRef.current && !textPickerRef.current.contains(e.target as Node)) {
        setShowTextPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignmentClass =
    watchedValues.alignment === "LEFT"
      ? "items-start text-left"
      : watchedValues.alignment === "RIGHT"
        ? "items-end text-right"
        : "items-center text-center";

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

        {/* Color pickers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
              Cor de fundo
            </label>
            <div className="relative" ref={bgPickerRef}>
              <button
                type="button"
                onClick={() => setShowBgPicker(!showBgPicker)}
                className="flex h-10 w-full items-center gap-3 rounded-lg border border-[var(--brand-border)] bg-white px-3.5 text-sm transition-colors focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10"
              >
                <span
                  className="size-6 shrink-0 rounded-md border border-[var(--brand-border)]"
                  style={{ backgroundColor: watchedValues.bgColor || "#ffffff" }}
                />
                <span className="truncate text-[var(--brand-black)]">
                  {watchedValues.bgColor || "Padrão"}
                </span>
              </button>
              {showBgPicker && (
                <div className="absolute left-0 top-12 z-50">
                  <ChromePicker
                    color={watchedValues.bgColor || "#ffffff"}
                    onChange={(color) => setValue("bgColor", color.hex)}
                    disableAlpha
                  />
                </div>
              )}
            </div>
            <input type="hidden" {...register("bgColor")} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
              Cor do texto
            </label>
            <div className="relative" ref={textPickerRef}>
              <button
                type="button"
                onClick={() => setShowTextPicker(!showTextPicker)}
                className="flex h-10 w-full items-center gap-3 rounded-lg border border-[var(--brand-border)] bg-white px-3.5 text-sm transition-colors focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10"
              >
                <span
                  className="size-6 shrink-0 rounded-md border border-[var(--brand-border)]"
                  style={{ backgroundColor: watchedValues.textColor || "#000000" }}
                />
                <span className="truncate text-[var(--brand-black)]">
                  {watchedValues.textColor || "Padrão"}
                </span>
              </button>
              {showTextPicker && (
                <div className="absolute left-0 top-12 z-50">
                  <ChromePicker
                    color={watchedValues.textColor || "#000000"}
                    onChange={(color) => setValue("textColor", color.hex)}
                    disableAlpha
                  />
                </div>
              )}
            </div>
            <input type="hidden" {...register("textColor")} />
          </div>
        </div>

        {/* Alignment */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
            Alinhamento do texto
          </label>
          <div className="flex gap-2">
            {ALIGNMENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue("alignment", opt.value)}
                className={`flex-1 rounded-lg border py-2.5 text-sm font-bold transition-all ${
                  watchedValues.alignment === opt.value
                    ? "border-[var(--brand-black)] bg-[var(--brand-black)] text-white"
                    : "border-[var(--brand-border)] bg-white text-[var(--brand-black)] hover:bg-[var(--brand-tertiary)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <input type="hidden" {...register("alignment")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Posição (ordem)"
            type="number"
            placeholder="0"
            {...register("position")}
            error={errors.position?.message}
          />
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-3 pb-2">
              <input
                type="checkbox"
                {...register("isActive")}
                className="size-4 rounded accent-[var(--brand-yellow)]"
              />
              <span className="text-sm font-medium text-[var(--brand-black)]">
                Hero ativo
              </span>
            </label>
          </div>
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
          className={`flex min-h-[220px] flex-col rounded-2xl border border-[var(--brand-border)] p-8 ${alignmentClass}`}
          style={{
            backgroundColor: watchedValues.bgColor || "var(--brand-tertiary)",
          }}
        >
          {watchedValues.title ? (
            <>
              <h3
                className="text-xl font-extrabold"
                style={{ color: watchedValues.textColor || "var(--brand-black)" }}
              >
                {watchedValues.title}
              </h3>
              {watchedValues.description && (
                <p
                  className="mt-2 max-w-sm text-sm"
                  style={{ color: watchedValues.textColor || "var(--brand-black)", opacity: 0.7 }}
                >
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
