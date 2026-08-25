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

export function getAuthErrorMessage(errorCode?: string | null) {
  if (!errorCode) {
    return null;
  }

  switch (errorCode.toLowerCase()) {
    case "access_denied":
      return "O login com Google foi cancelado ou o acesso foi negado.";
    case "invalid_callback_url":
    case "invalid_error_callback_url":
    case "callback_url_required":
      return "Houve um problema de redirecionamento no login. Tente novamente.";
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
