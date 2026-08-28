import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categoryUpdateSchema } from "@/lib/schemas/category";

// GET /api/categories/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  const category = await prisma.category.findFirst({
    where: { id, storeId: store.id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    return NextResponse.json({ error: "Categoria não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ category });
}

// PATCH /api/categories/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  const existing = await prisma.category.findFirst({
    where: { id, storeId: store.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Categoria não encontrada." }, { status: 404 });
  }

  const body = await request.json();
  const parsed = categoryUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return NextResponse.json({ category });
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
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar a categoria." },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  const existing = await prisma.category.findFirst({
    where: { id, storeId: store.id },
    include: { _count: { select: { products: true } } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Categoria não encontrada." }, { status: 404 });
  }

  if (existing._count.products > 0) {
    return NextResponse.json(
      {
        error: `Esta categoria possui ${existing._count.products} produto(s) vinculado(s). Remova ou reatribua os produtos antes de excluir.`,
      },
      { status: 409 }
    );
  }

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Erro ao excluir a categoria." },
      { status: 500 }
    );
  }
}
