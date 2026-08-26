"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  buildAuthPageHref,
  buildEmailVerificationPageHref,
  getAuthErrorCode,
  getAuthErrorMessage,
  resolveAuthRedirect,
  signIn,
} from "@/lib/auth-client";
import { GoogleButton } from "@/components/auth/google-button";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const redirectTarget = resolveAuthRedirect(searchParams.get("redirect"));
  const registerHref = buildAuthPageHref("/register", searchParams.get("redirect"));
  const displayError = error ?? getAuthErrorMessage(searchParams.get("error"));
  const verifiedNotice =
    searchParams.get("verified") === "1"
      ? "E-mail verificado com sucesso. Agora voce ja pode entrar na sua conta."
      : null;

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
        const authErrorCode = getAuthErrorCode(authError);

        if (authErrorCode === "EMAIL_NOT_VERIFIED") {
          router.push(
            buildEmailVerificationPageHref({
              email,
              redirect: redirectTarget,
              source: "signin",
            })
          );
          router.refresh();
          return;
        }

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
    <section className="flex flex-1 flex-col px-8 pb-8 sm:px-10 lg:px-12">
      <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col justify-center py-10 lg:py-16">
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-[25px]">
          Entrar na sua conta
        </h1>

        <div className="mt-7">
          <GoogleButton
            mode="signin"
            callbackURL={redirectTarget}
            errorCallbackURL={buildAuthPageHref("/login", searchParams.get("redirect"))}
            disabled={isPending}
          />
        </div>

        <div className="my-5 flex items-center gap-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          - OU -
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-sm text-muted-foreground" htmlFor="email">
            E-mail
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isPending}
              defaultValue={searchParams.get("email") ?? ""}
              placeholder="seu@email.com"
              className="h-7 border-b border-foreground/80 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground focus:border-accent disabled:opacity-50"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-muted-foreground" htmlFor="password">
            Senha
            <span className="relative flex items-center border-b border-foreground/80">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                disabled={isPending}
                minLength={8}
                placeholder="••••••••"
                className="h-7 w-full bg-transparent text-sm font-semibold tracking-[0.22em] text-foreground outline-none placeholder:tracking-normal placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                type="button"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </span>
          </label>

          {displayError && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {displayError}
            </div>
          )}

          {verifiedNotice && (
            <div className="rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-700">
              {verifiedNotice}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-1 inline-flex h-10 w-fit items-center gap-1.5 rounded-md border border-foreground bg-[#ffd400] px-5 text-sm font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--foreground)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--foreground)] disabled:pointer-events-none disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>

          <p className="text-sm text-muted-foreground">
            Ainda nao tem conta?{" "}
            <Link
              href={registerHref}
              className="font-bold text-foreground hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthPageFallback />}>
      <LoginPageContent />
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
