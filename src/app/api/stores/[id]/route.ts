import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { assertStoreCustomizationAccess, BillingAccessError } from "@/lib/billing/subscription";
import { prisma } from "@/lib/prisma";
import { storeUpdateSchema } from "@/lib/schemas/store";
import {
  buildStoreUpdateData,
  getStoreConflictMessage,
  storeAdminSelect,
} from "@/lib/store";

// GET /api/stores/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (!session.user.emailVerified) {
    return NextResponse.json(
      { error: "Verifique seu e-mail para acessar esta área." },
      { status: 403 }
    );
  }

  const { id } = await params;

  const store = await prisma.store.findFirst({
    where: { id, userId: session.user.id },
    select: storeAdminSelect,
  });

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ store });
}

// PATCH /api/stores/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (!session.user.emailVerified) {
    return NextResponse.json(
      { error: "Verifique seu e-mail para acessar esta área." },
      { status: 403 }
    );
  }

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.store.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, slug: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Payload inválido." },
      { status: 400 }
    );
  }

  const parsed = storeUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "Nenhum campo válido foi enviado." },
      { status: 400 }
    );
  }

  try {
    await assertStoreCustomizationAccess(session.user.id, {
      primaryColor: data.primaryColor || null,
      secondaryColor: data.secondaryColor || null,
      hideCatalogueiBranding: data.hideCatalogueiBranding,
    });
  } catch (error) {
    if (error instanceof BillingAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    throw error;
  }

  // Check slug uniqueness if changed
  if (data.slug && data.slug !== existing.slug) {
    const slugTaken = await prisma.store.findUnique({
      where: { slug: data.slug },
    });

    if (slugTaken) {
      return NextResponse.json(
        { error: "Esse endereço já está em uso. Escolha outro." },
        { status: 409 }
      );
    }
  }

  try {
    const result = await prisma.store.updateMany({
      where: { id, userId: session.user.id },
      data: buildStoreUpdateData(data),
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
    }

    const store = await prisma.store.findFirst({
      where: { id, userId: session.user.id },
      select: storeAdminSelect,
    });

    return NextResponse.json({ store });
  } catch (error) {
    const conflictMessage = getStoreConflictMessage(error);

    if (conflictMessage) {
      return NextResponse.json({ error: conflictMessage }, { status: 409 });
    }

    console.error("Error updating store:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar a loja." },
      { status: 500 }
    );
  }
}

// DELETE /api/stores/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (!session.user.emailVerified) {
    return NextResponse.json(
      { error: "Verifique seu e-mail para acessar esta área." },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    const result = await prisma.store.deleteMany({
      where: { id, userId: session.user.id },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting store:", error);
    return NextResponse.json(
      { error: "Erro ao excluir a loja." },
      { status: 500 }
    );
  }
}
