"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

/**
 * Botão "Entrar/Continuar com Google".
 *
 * Dispara `signIn.social({ provider: "google" })` do Better Auth, que
 * redireciona o navegador para a tela de consentimento do Google. Ao
 * voltar, o callback é tratado em `/api/auth/callback/google` e o
 * Better Auth cria a sessão automaticamente (e o usuário, se for
 * o primeiro acesso).
 *
 * O componente gerencia seu próprio estado de loading/erro porque a
 * chamada não passa pelo mesmo `useTransition` do form de e-mail/senha
 * — quando o redirect acontece, o componente é desmontado.
 */
interface GoogleButtonProps {
  /**
   * "signin" → "Entrar com Google"
   * "signup" → "Continuar com Google"
   */
  mode?: "signin" | "signup";
  /** URL para onde o usuário volta após o Google autenticar com sucesso. */
  callbackURL?: string;
  /** URL para onde o usuário volta se o provedor retornar erro. */
  errorCallbackURL?: string;
  disabled?: boolean;
}

export function GoogleButton({
  mode = "signin",
  callbackURL = "/admin/dashboard",
  errorCallbackURL = "/login",
  disabled = false,
}: GoogleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDisabled = disabled || isLoading;

  async function handleClick() {
    if (isDisabled) return;
    setIsLoading(true);
    setError(null);

    const { error: authError } = await signIn.social({
      provider: "google",
      callbackURL,
      errorCallbackURL,
    });

    // Se chegou aqui com erro, o redirect não foi disparado.
    // Em caso de sucesso, o navegador já está navegando para o Google.
    if (authError) {
      setError(
        authError.message ||
          "Não foi possível iniciar o login com Google. Tente novamente."
      );
      setIsLoading(false);
    }
  }

  const label = mode === "signup" ? "Continuar com Google" : "Entrar com Google";

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={handleClick}
        disabled={isDisabled}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Redirecionando...
          </>
        ) : (
          <>
            <GoogleIcon className="size-4" />
            {label}
          </>
        )}
      </Button>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * Logo "G" colorido oficial do Google (4 cores oficiais).
 * Renderizado inline (sem asset) para evitar request extra.
 */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
