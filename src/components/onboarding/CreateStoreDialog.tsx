"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, ArrowRight, Loader2, PartyPopper } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Confetti } from "@/components/ui/confetti";
import { Input, Textarea } from "@/components/ui/input";
import { onboardingSchema, generateSlug, type OnboardingFormData } from "./schema";

interface CreateStoreDialogProps {
  open: boolean;
  onStoreCreated: () => void;
}

export function CreateStoreDialog({ open, onStoreCreated }: CreateStoreDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const slugValue = watch("slug");

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue("name", value, { shouldValidate: true });
      if (!slugManuallyEdited) {
        setValue("slug", generateSlug(value), { shouldValidate: true });
      }
    },
    [setValue, slugManuallyEdited]
  );

  const handleSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSlugManuallyEdited(true);
      setValue("slug", e.target.value, { shouldValidate: true });
    },
    [setValue]
  );

  const onSubmit = async (data: OnboardingFormData) => {
    setServerError(null);

    try {
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || "Erro ao criar a loja.");
        return;
      }

      setShowSuccess(true);
      setShowConfetti(true);

      setTimeout(() => {
        onStoreCreated();
      }, 3000);
    } catch {
      setServerError("Erro de conexão. Tente novamente.");
    }
  };

  return (
    <>
      <Confetti active={showConfetti} duration={3000} />

      <Dialog open={open}>
        <DialogContent>
          {showSuccess ? (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-[var(--brand-yellow)]">
                <PartyPopper size={32} className="text-[var(--brand-black)]" />
              </div>
              <h2 className="text-xl font-extrabold text-[var(--brand-black)]">
                Sua loja foi criada!
              </h2>
              <p className="mt-2 max-w-xs text-sm font-medium text-[var(--brand-black)]/60">
                Parabéns! Agora você pode cadastrar produtos, personalizar o
                tema e começar a vender.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--brand-black)]/40">
                <Loader2 size={16} className="animate-spin" />
                Preparando seu painel...
              </div>
            </div>
          ) : (
            <>
              <DialogHeader>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-yellow)]">
                    <Store size={20} className="text-[var(--brand-black)]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-black)]/40">
                    Primeiro passo
                  </span>
                </div>
                <DialogTitle className="text-[var(--brand-black)]">
                  Vamos criar sua loja?
                </DialogTitle>
                <DialogDescription className="text-[var(--brand-black)]">
                  Em poucos passos você terá sua loja configurada e pronta para
                  começar a cadastrar seus produtos.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6">
                <div className="space-y-4">
                  <Input
                    label="Nome da loja"
                    placeholder="Ex: Tech Store"
                    {...register("name", { onChange: handleNameChange })}
                    error={errors.name?.message}
                  />

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
                      Endereço da loja
                    </label>
                    <div className="flex items-center overflow-hidden rounded-lg border border-[var(--brand-border)] bg-white focus-within:border-[var(--brand-black)] focus-within:ring-2 focus-within:ring-[var(--brand-black)]/10">
                      <span className="shrink-0 border-r border-[var(--brand-border)] bg-[var(--brand-tertiary)] px-3 py-2.5 text-sm font-medium text-[var(--brand-black)]/50">
                        cataloguei.com.br/
                      </span>
                      <input
                        type="text"
                        value={slugValue}
                        onChange={handleSlugChange}
                        placeholder="tech-store"
                        className="flex-1 bg-transparent px-3 py-2.5 text-sm font-medium text-[var(--brand-black)] outline-none"
                      />
                    </div>
                    {errors.slug ? (
                      <p className="mt-1.5 text-xs text-[var(--brand-error)]">
                        {errors.slug.message}
                      </p>
                    ) : (
                      <p className="mt-1.5 text-xs text-[var(--brand-black)]/40">
                        Esse será o endereço público da sua loja.
                      </p>
                    )}
                  </div>

                  <Textarea
                    label="Descrição da loja"
                    placeholder="Conte um pouco sobre sua loja"
                    rows={3}
                    {...register("description")}
                    error={errors.description?.message}
                  />
                </div>

                {serverError && (
                  <div className="mt-4 rounded-lg bg-[var(--brand-error-light)] px-4 py-3 text-sm font-medium text-[var(--brand-error)]">
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-[var(--brand-black)] transition-all hover:shadow-md disabled:opacity-60"
                  style={{ backgroundColor: "var(--brand-yellow)" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Criando loja...
                    </>
                  ) : (
                    <>
                      Criar minha loja
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
