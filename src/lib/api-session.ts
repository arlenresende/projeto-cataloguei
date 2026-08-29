import "server-only";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function requireVerifiedSession(forbiddenMessage?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (!session.user.emailVerified) {
    return NextResponse.json(
      {
        error:
          forbiddenMessage || "Verifique seu e-mail para acessar esta área.",
      },
      { status: 403 }
    );
  }

  return session;
}
