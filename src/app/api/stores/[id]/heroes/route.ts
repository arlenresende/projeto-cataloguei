import { NextResponse } from "next/server";
import { requireVerifiedSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";
import { storeHeroSchema } from "@/lib/schemas/store-hero";

// GET /api/stores/[id]/heroes — list heroes of the user's store
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireVerifiedSession();
  if (session instanceof NextResponse) {
    return session;
  }

  const { id } = await params;

  // Verify store ownership
  const store = await prisma.store.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  const heroes = await prisma.storeHero.findMany({
    where: { storeId: store.id },
    orderBy: { position: "asc" },
  });

  return NextResponse.json({ heroes });
}

// POST /api/stores/[id]/heroes — create a hero
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireVerifiedSession();
  if (session instanceof NextResponse) {
    return session;
  }

  const { id } = await params;

  // Verify store ownership
  const store = await prisma.store.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  const body = await request.json();
  const parsed = storeHeroSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const hero = await prisma.storeHero.create({
      data: {
        storeId: store.id,
        title: data.title,
        description: data.description || null,
        image: data.image || null,
        bgColor: data.bgColor || null,
        textColor: data.textColor || null,
        alignment: data.alignment,
        buttonText: data.buttonText || null,
        buttonUrl: data.buttonUrl || null,
        position: data.position,
        isActive: data.isActive,
      },
    });

    return NextResponse.json({ hero }, { status: 201 });
  } catch (error) {
    console.error("Error creating hero:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar o hero." },
      { status: 500 }
    );
  }
}
