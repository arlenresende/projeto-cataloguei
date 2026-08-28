"use client";

import { useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight } from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import {
  storeSchema,
  generateSlug,
  type StoreFormData,
  type StoreFormInput,
} from "@/lib/schemas/store";

const THEME_OPTIONS = [
  { value: "DEFAULT", label: "Padrão" },
  { value: "TECHNOLOGY", label: "Tecnologia" },
  { value: "FOOD", label: "Alimentação" },
  { value: "FASHION", label: "Moda" },
  { value: "HEALTH", label: "Saúde" },
  { value: "EDUCATION", label: "Educação" },
  { value: "BEAUTY", label: "Beleza" },
  { value: "SPORTS", label: "Esportes" },
  { value: "MUSIC", label: "Música" },
  { value: "MINIMAL", label: "Minimalista" },
  { value: "LUXURY", label: "Luxo" },
  { value: "NATURE", label: "Natureza" },
  { value: "KIDS", label: "Infantil" },
  { value: "PET", label: "Pet" },
  { value: "AUTOMOTIVE", label: "Automotivo" },
  { value: "ART", label: "Arte" },
];

interface StoreFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<StoreFormData>;
  onSubmit: (data: StoreFormData) => Promise<void>;
  serverError?: string | null;
  isSubmitting?: boolean;
}

export function StoreForm({
  mode,
  defaultValues,
  onSubmit,
  serverError,
  isSubmitting,
}: StoreFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<StoreFormInput, unknown, StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Brasil",
      email: "",
      logo: "",
      websiteUrl: "",
      whatsappUrl: "",
      instagramUrl: "",
      facebookUrl: "",
      phoneNumber: "",
      cellPhone: "",
      themeStore: "DEFAULT",
      isActive: true,
      ...defaultValues,
    },
  });

  const slugValue = String(useWatch({ control, name: "slug" }) ?? "");
  const isActive = Boolean(useWatch({ control, name: "isActive" }));

  // Auto-generate slug from name (only in create mode)
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue("name", value, { shouldValidate: true });
      if (mode === "create") {
        setValue("slug", generateSlug(value), { shouldValidate: true });
      }
    },
    [setValue, mode]
  );

  const selectClass =
    "flex h-10 w-full appearance-none rounded-lg border border-[var(--brand-border)] bg-white px-3.5 text-sm text-[var(--brand-black)] transition-colors focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Main info */}
      <section>
        <h3 className="mb-4 text-base font-bold text-[var(--brand-black)]">
          Informações principais
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Nome da loja"
              placeholder="Ex: Tech Store"
              {...register("name", { onChange: handleNameChange })}
              error={errors.name?.message}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
              Endereço da loja (slug)
            </label>
            <div className="flex items-center overflow-hidden rounded-lg border border-[var(--brand-border)] bg-white focus-within:border-[var(--brand-black)] focus-within:ring-2 focus-within:ring-[var(--brand-black)]/10">
              <span className="shrink-0 border-r border-[var(--brand-border)] bg-[var(--brand-tertiary)] px-3 py-2.5 text-sm font-medium text-[var(--brand-black)]/50">
                cataloguei.com.br/
              </span>
              <input
                type="text"
                value={slugValue}
                onChange={(e) =>
                  setValue("slug", generateSlug(e.target.value), {
                    shouldValidate: true,
                  })
                }
                placeholder="tech-store"
                className="flex-1 bg-transparent px-3 py-2.5 text-sm font-medium text-[var(--brand-black)] outline-none"
              />
            </div>
            {errors.slug && (
              <p className="mt-1.5 text-xs text-[var(--brand-error)]">
                {errors.slug.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Descrição"
              placeholder="Conte um pouco sobre sua loja"
              rows={3}
              {...register("description")}
              error={errors.description?.message}
            />
          </div>
        </div>
      </section>

      {/* Address */}
      <section>
        <h3 className="mb-4 text-base font-bold text-[var(--brand-black)]">
          Endereço
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Endereço"
              placeholder="Rua, número, bairro"
              {...register("address")}
              error={errors.address?.message}
            />
          </div>
          <Input
            label="Cidade"
            placeholder="São Paulo"
            {...register("city")}
            error={errors.city?.message}
          />
          <Input
            label="Estado"
            placeholder="SP"
            {...register("state")}
            error={errors.state?.message}
          />
          <Input
            label="CEP"
            placeholder="00000-000"
            {...register("postalCode")}
            error={errors.postalCode?.message}
          />
          <Input
            label="País"
            placeholder="Brasil"
            {...register("country")}
            error={errors.country?.message}
          />
        </div>
      </section>

      {/* Contact */}
      <section>
        <h3 className="mb-4 text-base font-bold text-[var(--brand-black)]">
          Contato
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Email"
            placeholder="contato@loja.com"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="WhatsApp"
            placeholder="https://wa.me/5511999999999"
            {...register("whatsappUrl")}
            error={errors.whatsappUrl?.message}
          />
          <Input
            label="Telefone"
            placeholder="(11) 3333-4444"
            {...register("phoneNumber")}
            error={errors.phoneNumber?.message}
          />
          <Input
            label="Celular"
            placeholder="(11) 99999-9999"
            {...register("cellPhone")}
            error={errors.cellPhone?.message}
          />
        </div>
      </section>

      {/* Online presence */}
      <section>
        <h3 className="mb-4 text-base font-bold text-[var(--brand-black)]">
          Redes sociais e presença online
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Website"
            placeholder="https://www.sualoja.com.br"
            {...register("websiteUrl")}
            error={errors.websiteUrl?.message}
          />
          <Input
            label="Instagram"
            placeholder="https://instagram.com/sualoja"
            {...register("instagramUrl")}
            error={errors.instagramUrl?.message}
          />
          <Input
            label="Facebook"
            placeholder="https://facebook.com/sualoja"
            {...register("facebookUrl")}
            error={errors.facebookUrl?.message}
          />
          <Input
            label="Logo (URL)"
            placeholder="https://..."
            {...register("logo")}
            error={errors.logo?.message}
          />
        </div>
      </section>

      {/* Settings */}
      <section>
        <h3 className="mb-4 text-base font-bold text-[var(--brand-black)]">
          Configurações
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
              Tema da loja
            </label>
            <select {...register("themeStore")} className={selectClass}>
              {THEME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {mode === "edit" ? (
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  onClick={() =>
                    setValue("isActive", !isActive, { shouldValidate: true })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isActive ? "bg-[var(--brand-yellow)]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${
                      isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-[var(--brand-black)]">
                  {isActive ? "Loja ativa" : "Loja inativa"}
                </span>
              </label>
              <input type="hidden" {...register("isActive")} />
            </div>
          ) : null}
        </div>
      </section>

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
            {mode === "create" ? "Criando loja..." : "Salvando alterações..."}
          </>
        ) : (
          <>
            {mode === "create" ? "Criar loja" : "Salvar alterações"}
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
