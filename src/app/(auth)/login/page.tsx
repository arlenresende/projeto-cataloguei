"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";
import {
  buildAuthPageHref,
  getAuthErrorMessage,
  resolveAuthRedirect,
  signIn,
} from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/auth/google-button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const redirectTarget = resolveAuthRedirect(searchParams.get("redirect"));
  const registerHref = buildAuthPageHref("/register", searchParams.get("redirect"));
  const displayError = error ?? getAuthErrorMessage(searchParams.get("error"));

  function handleSubmit(e: Parameters<NonNullable<React.ComponentProps<"form">["onSubmit"]>>[0]) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      const { error: authError } = await signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(
          authError.message ||
            "Não foi possível entrar. Verifique seus dados e tente novamente."
        );
        return;
      }

      router.push(redirectTarget);
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Entrar na sua conta
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Acesse seu painel para gerenciar seu catálogo.
        </p>
      </div>

      <div className="space-y-4">
        <GoogleButton
          mode="signin"
          callbackURL={redirectTarget}
          errorCallbackURL={buildAuthPageHref("/login", searchParams.get("redirect"))}
          disabled={isPending}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-zinc-500">ou</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-zinc-700"
          >
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isPending}
            placeholder="seu@email.com"
            className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20 disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-700"
          >
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={isPending}
            minLength={8}
            placeholder="••••••••"
            className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20 disabled:opacity-50"
          />
        </div>

        {displayError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {displayError}
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Entrando...
            </>
          ) : (
            <>
              <LogIn className="size-4" />
              Entrar
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Ainda não tem conta?{" "}
        <Link
          href={registerHref}
          className="font-medium text-violet-600 hover:text-violet-700 hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}
