import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Route protection do Better Auth (Next.js 16 usa `proxy.ts`).
 *
 * Em `proxy.ts` o ideal é fazer uma checagem leve via cookie
 * (não consulta o DB). A validação completa (revogação, expiração)
 * é feita em Server Components e Server Actions via
 * `auth.api.getSession({ headers: await headers() })`.
 *
 * Rotas protegidas:
 *   /admin/*  → exige usuário logado
 *
 * Se não estiver logado:
 *   /admin  → redireciona para /login
 *
 * Se já estiver logado:
 *   /login, /register → redireciona para /admin
 */
const protectedPrefixes = ["/admin"];
const authOnlyPrefixes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isAuthOnly = authOnlyPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  // O cookie é suficiente para decidir redirecionamentos.
  // getSessionCookie valida apenas presença/nome, sem ir ao DB.
  const session = getSessionCookie(request);

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthOnly && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica em todas as rotas exceto:
     * - api (rotas de API, incluindo /api/auth/*)
     * - _next (assets internos)
     * - arquivos estáticos
     */
    "/((?!api|_next/static|_next/image|favicon.ico|placeholder-.*|.*\\.svg$).*)",
  ],
};
