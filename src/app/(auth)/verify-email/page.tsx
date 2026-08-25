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
import { Button } from "@/components/ui/button";

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
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-violet-50 text-violet-600">
          <MailCheck className="size-6" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          {source === "signin" ? "Confirme seu e-mail" : "Cadastro realizado!"}
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          {source === "signin"
            ? "Sua conta ainda nao foi ativada. Verifique sua caixa de entrada para continuar."
            : "Enviamos um e-mail para o endereco informado. Verifique sua caixa de entrada para ativar sua conta."}
        </p>
      </div>

      <div className="space-y-4">
        {email && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
            E-mail: <span className="font-medium">{email}</span>
          </div>
        )}

        {displayError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {displayError}
          </div>
        )}

        {notice && (
          <div className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-700">
            {notice}
          </div>
        )}

        <Button
          type="button"
          variant="default"
          size="lg"
          className="w-full"
          onClick={handleResend}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Reenviando...
            </>
          ) : (
            <>
              <RotateCw className="size-4" />
              Reenviar e-mail
            </>
          )}
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Ja verificou?{" "}
        <Link
          href={loginHref}
          className="font-medium text-violet-600 hover:text-violet-700 hover:underline"
        >
          Entrar
        </Link>
      </p>

      <p className="mt-2 text-center text-sm text-zinc-500">
        Ainda nao criou conta?{" "}
        <Link
          href={registerHref}
          className="font-medium text-violet-600 hover:text-violet-700 hover:underline"
        >
          Cadastrar
        </Link>
      </p>
    </div>
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
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
        <Loader2 className="size-4 animate-spin" />
        Carregando...
      </div>
    </div>
  );
}
