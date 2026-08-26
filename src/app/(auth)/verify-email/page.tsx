"use client";

import Link from "next/link";
import { Suspense, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, MailCheck, RotateCw } from "lucide-react";
import {
  authClient,
  buildAuthPageHref,
  buildEmailVerificationCallbackURL,
  getAuthErrorCode,
  getAuthErrorMessage,
  resolveAuthRedirect,
} from "@/lib/auth-client";

function VerifyEmailPageContent() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const email = searchParams.get("email");
  const source = searchParams.get("source");
  const redirectTarget = resolveAuthRedirect(searchParams.get("redirect"));
  const loginHref = buildAuthPageHref("/login", searchParams.get("redirect"));
  const registerHref = buildAuthPageHref("/register", searchParams.get("redirect"));
  const displayError = error ?? getAuthErrorMessage(searchParams.get("error"));

  function handleResend() {
    if (!email) {
      setError("Informe seu e-mail na tela de login para reenviar a verificacao.");
      setNotice(null);
      return;
    }

    setError(null);
    setNotice(null);

    startTransition(async () => {
      const { error: resendError } = await authClient.sendVerificationEmail({
        email,
        callbackURL: buildEmailVerificationCallbackURL({
          email,
          redirect: redirectTarget,
        }),
      });

      if (resendError) {
        const errorCode = getAuthErrorCode(resendError);

        setError(
          getAuthErrorMessage(errorCode) ||
            resendError.message ||
            "Nao foi possivel reenviar o e-mail de verificacao."
        );
        return;
      }

      setNotice("Enviamos um novo link de verificacao para o seu e-mail.");
    });
  }

  return (
    <section className="flex flex-1 flex-col px-8 pb-8 sm:px-10 lg:px-12">
      <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col justify-center py-10 lg:py-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <MailCheck className="size-5" />
          </div>

          <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-[25px]">
            {source === "signin" ? "Confirme seu e-mail" : "Cadastro realizado!"}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {source === "signin"
              ? "Sua conta ainda nao foi ativada. Verifique sua caixa de entrada para continuar."
              : "Enviamos um e-mail para o endereco informado. Verifique sua caixa de entrada para ativar sua conta."}
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-4">
          {email && (
            <div className="rounded-md border-b border-foreground/80 px-1 py-2 text-sm font-semibold text-foreground">
              {email}
            </div>
          )}

          {displayError && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {displayError}
            </div>
          )}

          {notice && (
            <div className="rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-700">
              {notice}
            </div>
          )}

          <button
            type="button"
            onClick={handleResend}
            disabled={isPending}
            className="inline-flex h-10 w-fit items-center gap-1.5 rounded-md border border-foreground bg-[#ffd400] px-5 text-sm font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--foreground)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--foreground)] disabled:pointer-events-none disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                Reenviando...
              </>
            ) : (
              <>
                <RotateCw className="size-3" />
                Reenviar e-mail
              </>
            )}
          </button>

          <p className="text-sm text-muted-foreground">
            Ja verificou?{" "}
            <Link
              href={loginHref}
              className="font-bold text-foreground hover:underline"
            >
              Entrar
            </Link>
          </p>

          <p className="text-sm text-muted-foreground">
            Ainda nao criou conta?{" "}
            <Link
              href={registerHref}
              className="font-bold text-foreground hover:underline"
            >
              Cadastrar
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<AuthPageFallback />}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}

function AuthPageFallback() {
  return (
    <section className="flex flex-1 flex-col px-8 pb-8 sm:px-10 lg:px-12">
      <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col items-center justify-center py-10 lg:py-16">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
        <p className="mt-2 text-[10px] text-muted-foreground">Carregando...</p>
      </div>
    </section>
  );
}
