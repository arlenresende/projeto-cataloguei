import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

/**
 * Better Auth - configuração server-side.
 *
 * - Adapter: Prisma (usa o singleton de `src/lib/prisma.ts` que já
 *   está configurado com driver adapter PrismaPg para Supabase).
 * - Email/senha habilitado (com confirmação por email desabilitada
 *   para simplificar o MVP; pode ser ligada depois via `requireEmailVerification`).
 * - Login social com Google (OAuth 2.0 / OIDC). O cadastro do
 *   usuário é automático no primeiro login — não precisa de tela
 *   de registro separada quando ele entra via Google.
 * - `nextCookies()` é obrigatório no Next.js para que Server Actions
 *   e Route Handlers consigam setar cookies de sessão.
 *
 * Lendo variáveis:
 * - BETTER_AUTH_SECRET: chave usada para assinar cookies/JWTs (obrigatório)
 * - BETTER_AUTH_URL: URL base da app (obrigatório em produção)
 * - NEXT_PUBLIC_APP_URL: fallback quando BETTER_AUTH_URL não existe
 * - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET: credenciais do OAuth Client
 *   criado em https://console.cloud.google.com (Authorized redirect URI:
 *   {BETTER_AUTH_URL}/api/auth/callback/google)
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  socialProviders: {
    /**
     * Google OAuth.
     *
     * `accessType: "offline"` força o Google a devolver o `refresh_token`
     * (necessário se quisermos chamar Google APIs no futuro sem novo login).
     * `prompt: "select_account"` sempre mostra o seletor de conta, mesmo
     * se o usuário já estiver logado no Google (UX mais previsível).
     */
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account",
    },
  },

  // Necessário no Next.js para gerenciar cookies em Server Actions
  plugins: [nextCookies()],
});

/**
 * Tipo da sessão exposta por `auth.api.getSession()`. Importar de
 * outros lugares para evitar `any` em componentes que recebem a sessão.
 */
export type Session = typeof auth.$Infer.Session;
