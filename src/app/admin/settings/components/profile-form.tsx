"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  currentName: string;
  email: string;
}

export function ProfileForm({ currentName, email }: ProfileFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: currentName },
  });

  async function onSubmit(data: ProfileFormData) {
    setServerError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const result = await authClient.updateUser({
        name: data.name,
      });

      if (result.error) {
        setServerError("Erro ao atualizar o perfil. Tente novamente.");
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setServerError("Erro de conexão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome"
        placeholder="Seu nome"
        {...register("name")}
        error={errors.name?.message}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
          E-mail
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="h-10 w-full rounded-lg border border-[var(--brand-border)] bg-[var(--brand-tertiary)] px-3.5 text-sm text-[var(--brand-black)]/60 cursor-not-allowed"
        />
        <p className="mt-1.5 text-xs text-[var(--brand-black)]/40">
          O e-mail não pode ser alterado pois é usado para autenticação.
        </p>
      </div>

      {serverError && (
        <div className="rounded-lg bg-[var(--brand-error-light)] px-4 py-3 text-sm font-medium text-[var(--brand-error)]">
          {serverError}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-[var(--brand-success-light)] px-4 py-3 text-sm font-medium text-[var(--brand-success)]">
          Perfil atualizado com sucesso!
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-[var(--brand-yellow)] px-5 py-2.5 text-sm font-bold text-[var(--brand-black)] transition-all hover:shadow-md disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Salvando...
            </>
          ) : success ? (
            <>
              <Check size={16} />
              Salvo!
            </>
          ) : (
            "Salvar alterações"
          )}
        </button>
      </div>
    </form>
  );
}
