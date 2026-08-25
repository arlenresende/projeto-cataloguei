import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

/**
 * Mount point do Better Auth.
 * Better Auth expõe todos os endpoints sob /api/auth/*:
 *  - POST /api/auth/sign-up/email
 *  - POST /api/auth/sign-in/email
 *  - POST /api/auth/sign-out
 *  - GET  /api/auth/get-session
 *  - etc.
 *
 * `[...all]` é o catch-all do Next.js para que qualquer sub-rota
 * (sign-up, sign-in, sign-out, session, etc.) seja roteada para cá.
 */
export const { POST, GET } = toNextJsHandler(auth);
