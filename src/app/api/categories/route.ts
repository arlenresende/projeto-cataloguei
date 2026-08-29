import { NextResponse } from "next/server";
import { requireVerifiedSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";
import { categoryCreateSchema } from "@/lib/schemas/category";
import { getPrismaErrorCode } from "@/lib/prisma-error";

// GET /api/categories — list categories of the user's store
export async function GET() {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de acessar categorias."
  );
  if (session instanceof NextResponse) {
    return session;
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
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de criar categorias."
  );
  if (session instanceof NextResponse) {
    return session;
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
    if (getPrismaErrorCode(error) === "P2002") {
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
