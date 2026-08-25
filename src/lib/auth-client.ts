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

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
