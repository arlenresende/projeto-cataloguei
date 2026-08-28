import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storeHeroSchema } from "@/lib/schemas/store-hero";

// PATCH /api/stores/[id]/heroes/[heroId]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; heroId: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
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

  try {
    const hero = await prisma.storeHero.update({
      where: { id: heroId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.image !== undefined && { image: data.image || null }),
        ...(data.bgColor !== undefined && { bgColor: data.bgColor || null }),
        ...(data.alignment !== undefined && { alignment: data.alignment }),
        ...(data.buttonText !== undefined && { buttonText: data.buttonText || null }),
        ...(data.buttonUrl !== undefined && { buttonUrl: data.buttonUrl || null }),
        ...(data.position !== undefined && { position: data.position }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
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
    await prisma.storeHero.delete({ where: { id: heroId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting hero:", error);
    return NextResponse.json(
      { error: "Erro ao excluir o hero." },
      { status: 500 }
    );
  }
}
