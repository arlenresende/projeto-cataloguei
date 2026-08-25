import { createAuthClient } from "better-auth/react";

/**
 * Better Auth - cliente React.
 *
 * Usado em Client Components e Server Actions para chamar
 * `signIn`, `signUp`, `signOut`, `useSession`, etc.
 *
 * O `baseURL` é resolvido por ordem:
 * 1. `NEXT_PUBLIC_BETTER_AUTH_URL` (variável pública)
 * 2. `NEXT_PUBLIC_APP_URL`
 * 3. `window.location.origin` em runtime (fallback)
 */
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL,
});

export const DEFAULT_AUTH_REDIRECT = "/admin/dashboard";
export const AUTH_VERIFICATION_PAGE = "/verify-email";

export function resolveAuthRedirect(redirect?: string | null) {
  if (!redirect) {
    return DEFAULT_AUTH_REDIRECT;
  }

  // Aceita apenas rotas internas simples para evitar open redirect.
  if (!redirect.startsWith("/") || redirect.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  return redirect;
}

export function buildAuthPageHref(
  pathname: "/login" | "/register",
  redirect?: string | null
) {
  const safeRedirect = resolveAuthRedirect(redirect);

  if (safeRedirect === DEFAULT_AUTH_REDIRECT) {
    return pathname;
  }

  const params = new URLSearchParams({ redirect: safeRedirect });
  return `${pathname}?${params.toString()}`;
}

export function buildEmailVerificationPageHref(options: {
  email?: string | null;
  redirect?: string | null;
  source?: "signup" | "signin";
}) {
  const params = new URLSearchParams();
  const safeRedirect = resolveAuthRedirect(options.redirect);

  if (options.email) {
    params.set("email", options.email);
  }

  if (options.source) {
    params.set("source", options.source);
  }

  if (safeRedirect !== DEFAULT_AUTH_REDIRECT) {
    params.set("redirect", safeRedirect);
  }

  const query = params.toString();
  return query ? `${AUTH_VERIFICATION_PAGE}?${query}` : AUTH_VERIFICATION_PAGE;
}

export function buildEmailVerificationCallbackURL(options?: {
  email?: string | null;
  redirect?: string | null;
}) {
  const params = new URLSearchParams({ verified: "1" });
  const safeRedirect = resolveAuthRedirect(options?.redirect);

  if (options?.email) {
    params.set("email", options.email);
  }

  if (safeRedirect !== DEFAULT_AUTH_REDIRECT) {
    params.set("redirect", safeRedirect);
  }

  return `/login?${params.toString()}`;
}

type AuthErrorLike = {
  code?: string;
  message?: string;
  error?: {
    code?: string;
  };
};

export function getAuthErrorCode(error?: AuthErrorLike | null) {
  return error?.code ?? error?.error?.code ?? null;
}

export function getAuthErrorMessage(errorCode?: string | null) {
  if (!errorCode) {
    return null;
  }

  switch (errorCode.toLowerCase()) {
    case "access_denied":
      return "O login com Google foi cancelado ou o acesso foi negado.";
    case "email_not_verified":
      return "Sua conta ainda nao foi verificada. Confira seu e-mail para continuar.";
    case "invalid_callback_url":
    case "invalid_error_callback_url":
    case "callback_url_required":
      return "Houve um problema de redirecionamento no login. Tente novamente.";
    case "token_expired":
      return "O link de verificacao expirou. Solicite um novo e-mail para continuar.";
    case "invalid_token":
      return "O link de verificacao e invalido ou ja foi utilizado.";
    case "email_already_verified":
      return "Este e-mail ja foi verificado. Voce ja pode entrar na sua conta.";
    case "user_not_found":
      return "Nao encontramos essa conta. Tente fazer um novo cadastro.";
    default:
      return "Nao foi possivel concluir a autenticacao. Tente novamente.";
  }
}

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
