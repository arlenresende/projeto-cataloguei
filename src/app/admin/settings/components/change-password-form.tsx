"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Check, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Informe sua senha atual."),
    newPassword: z
      .string()
      .min(8, "A nova senha deve ter pelo menos 8 caracteres.")
      .max(128, "A senha deve ter no máximo 128 caracteres."),
    confirmPassword: z
      .string()
      .min(1, "Confirme a nova senha."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(data: ChangePasswordFormData) {
    setServerError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const result = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (result.error) {
        const msg =
          (result.error as { message?: string }).message ||
          "Erro ao alterar a senha. Verifique sua senha atual.";
        setServerError(msg);
        return;
      }

      setSuccess(true);
      reset();
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
        label="Senha atual"
        type="password"
        placeholder="••••••••"
        {...register("currentPassword")}
        error={errors.currentPassword?.message}
      />

      <Input
        label="Nova senha"
        type="password"
        placeholder="••••••••"
        {...register("newPassword")}
        error={errors.newPassword?.message}
      />

      <Input
        label="Confirmar nova senha"
        type="password"
        placeholder="••••••••"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      {serverError && (
        <div className="rounded-lg bg-[var(--brand-error-light)] px-4 py-3 text-sm font-medium text-[var(--brand-error)]">
          {serverError}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-[var(--brand-success-light)] px-4 py-3 text-sm font-medium text-[var(--brand-success)]">
          Senha alterada com sucesso!
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
              Alterando...
            </>
          ) : success ? (
            <>
              <Check size={16} />
              Alterada!
            </>
          ) : (
            <>
              <Shield size={16} />
              Alterar senha
            </>
          )}
        </button>
      </div>
    </form>
  );
}
