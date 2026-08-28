import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categoryCreateSchema } from "@/lib/schemas/category";

// GET /api/categories — list categories of the user's store
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  const categories = await prisma.category.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({ categories });
}

// POST /api/categories — create a category
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (!session.user.emailVerified) {
    return NextResponse.json(
      { error: "Verifique seu e-mail antes de criar categorias." },
      { status: 403 }
    );
  }

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  const body = await request.json();
  const parsed = categoryCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const category = await prisma.category.create({
      data: {
        storeId: store.id,
        name: data.name,
        description: data.description || null,
        slug: data.slug,
        isActive: data.isActive,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as any).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Já existe uma categoria com esse slug nesta loja." },
        { status: 409 }
      );
    }
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Erro ao criar a categoria." },
      { status: 500 }
    );
  }
}
