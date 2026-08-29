import { NextResponse } from "next/server";
import { requireVerifiedSession } from "@/lib/api-session";
import {
  assertCanCreateOrActivateBanner,
  BillingAccessError,
} from "@/lib/billing/subscription";
import { prisma } from "@/lib/prisma";
import { storeHeroSchema } from "@/lib/schemas/store-hero";

// PATCH /api/stores/[id]/heroes/[heroId]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; heroId: string }> }
) {
  const session = await requireVerifiedSession();
  if (session instanceof NextResponse) {
    return session;
  }

  const { id, heroId } = await params;

  // Verify store ownership
  const store = await prisma.store.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  // Verify hero belongs to store
  const existing = await prisma.storeHero.findFirst({
    where: { id: heroId, storeId: store.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Hero não encontrado." }, { status: 404 });
  }

  const body = await request.json();
  const parsed = storeHeroSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (data.isActive === true && !existing.isActive) {
    try {
      await assertCanCreateOrActivateBanner(session.user.id, store.id);
    } catch (error) {
      if (error instanceof BillingAccessError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }

      throw error;
    }
  }

  try {
    const result = await prisma.storeHero.updateMany({
      where: { id: heroId, storeId: store.id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.image !== undefined && { image: data.image || null }),
        ...(data.bgColor !== undefined && { bgColor: data.bgColor || null }),
        ...(data.textColor !== undefined && { textColor: data.textColor || null }),
        ...(data.alignment !== undefined && { alignment: data.alignment }),
        ...(data.buttonText !== undefined && { buttonText: data.buttonText || null }),
        ...(data.buttonUrl !== undefined && { buttonUrl: data.buttonUrl || null }),
        ...(data.position !== undefined && { position: data.position }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Hero não encontrado." }, { status: 404 });
    }

    const hero = await prisma.storeHero.findFirst({
      where: { id: heroId, storeId: store.id },
    });

    return NextResponse.json({ hero });
  } catch (error) {
    console.error("Error updating hero:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar o hero." },
      { status: 500 }
    );
  }
}

// DELETE /api/stores/[id]/heroes/[heroId]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; heroId: string }> }
) {
  const session = await requireVerifiedSession();
  if (session instanceof NextResponse) {
    return session;
  }

  const { id, heroId } = await params;

  // Verify store ownership
  const store = await prisma.store.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  // Verify hero belongs to store
  const existing = await prisma.storeHero.findFirst({
    where: { id: heroId, storeId: store.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Hero não encontrado." }, { status: 404 });
  }

  try {
    const result = await prisma.storeHero.deleteMany({
      where: { id: heroId, storeId: store.id },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Hero não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting hero:", error);
    return NextResponse.json(
      { error: "Erro ao excluir o hero." },
      { status: 500 }
    );
  }
}
