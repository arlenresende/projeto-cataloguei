import { NextResponse } from "next/server";
import { z } from "zod";
import { requireVerifiedSession } from "@/lib/api-session";
import { createAuditLog } from "@/lib/audit-log";
import { isAdminUser } from "@/lib/feature-requests";
import { prisma } from "@/lib/prisma";

const suspensionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("suspend"),
    reason: z
      .string()
      .trim()
      .min(3, "Informe o motivo da suspensão.")
      .max(500, "O motivo deve ter no máximo 500 caracteres."),
  }),
  z.object({
    action: z.literal("restore"),
  }),
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestHeaders = request.headers;
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de alterar lojas."
  );
  if (session instanceof NextResponse) {
    return session;
  }

  const isAdmin = await isAdminUser({
    userId: session.user.id,
    email: session.user.email,
  });

  if (!isAdmin) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  let input: z.infer<typeof suspensionSchema>;

  try {
    input = suspensionSchema.parse(await request.json());
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.issues[0]?.message
        : "Dados inválidos.";
    return NextResponse.json(
      { error: message || "Dados inválidos." },
      { status: 400 }
    );
  }

  const { id } = await params;
  const existingStore = await prisma.store.findUnique({
    where: { id },
    select: { id: true, name: true, slug: true, isActive: true, adminSuspendedAt: true },
  });

  if (!existingStore) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  const data =
    input.action === "suspend"
      ? {
          isActive: false,
          adminSuspendedAt: new Date(),
          adminSuspensionReason: input.reason,
          adminSuspendedById: session.user.id,
        }
      : {
          isActive: true,
          adminSuspendedAt: null,
          adminSuspensionReason: null,
          adminSuspendedById: null,
        };

  const store = await prisma.store.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      adminSuspendedAt: true,
      adminSuspensionReason: true,
      adminSuspendedById: true,
    },
  });

  await createAuditLog({
    action: input.action === "suspend" ? "STORE_SUSPENDED" : "STORE_RESTORED",
    actor: {
      id: session.user.id,
      email: session.user.email,
    },
    targetType: "STORE",
    targetId: store.id,
    storeId: store.id,
    metadata: {
      name: store.name,
      slug: store.slug,
      previousIsActive: existingStore.isActive,
      previousAdminSuspendedAt: existingStore.adminSuspendedAt?.toISOString() ?? null,
      reason: input.action === "suspend" ? input.reason : null,
    },
    request: { headers: requestHeaders },
  });

  return NextResponse.json({ store });
}
