import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productUpdateSchema } from "@/lib/schemas/product";
import { getPrismaErrorCode, prismaTargetIncludes } from "@/lib/prisma-error";

// GET /api/products/[id]
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

  const product = await prisma.product.findFirst({
    where: { id, storeId: store.id },
    include: {
      categoryRel: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { position: "asc" } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ product });
}

// PATCH /api/products/[id]
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

  const existing = await prisma.product.findFirst({
    where: { id, storeId: store.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  const body = await request.json();
  const parsed = productUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Validate category belongs to store if provided
  if (data.categoryId) {
    const cat = await prisma.category.findFirst({
      where: { id: data.categoryId, storeId: store.id },
      select: { id: true, name: true },
    });
    if (!cat) {
      return NextResponse.json(
        { error: "Categoria não encontrada nesta loja." },
        { status: 400 }
      );
    }
  }

  try {
    // Resolve category name if categoryId is being set
    let categoryName: string | null | undefined;
    if (data.categoryId !== undefined) {
      if (data.categoryId) {
        const cat = await prisma.category.findUnique({
          where: { id: data.categoryId },
          select: { name: true },
        });
        categoryName = cat?.name || null;
      } else {
        categoryName = null;
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.descriptionHtml !== undefined && { descriptionHtml: data.descriptionHtml || null }),
        ...(data.sku !== undefined && { sku: data.sku || null }),
        ...(data.barcode !== undefined && { barcode: data.barcode || null }),
        ...(data.brand !== undefined && { brand: data.brand || null }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.compareAtPrice !== undefined && { compareAtPrice: data.compareAtPrice || null }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.minStock !== undefined && { minStock: data.minStock || null }),
        ...(data.weight !== undefined && { weight: data.weight || null }),
        ...(data.categoryId !== undefined && {
          categoryId: data.categoryId || null,
          category: categoryName,
        }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.active !== undefined && { active: data.active }),
        ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle || null }),
        ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription || null }),
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    if (getPrismaErrorCode(error) === "P2002") {
      if (prismaTargetIncludes(error, "slug")) {
        return NextResponse.json(
          { error: "Já existe um produto com esse slug nesta loja." },
          { status: 409 }
        );
      }
      if (prismaTargetIncludes(error, "sku")) {
        return NextResponse.json(
          { error: "Já existe um produto com esse SKU nesta loja." },
          { status: 409 }
        );
      }
    }
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar o produto." },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]
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

  const existing = await prisma.product.findFirst({
    where: { id, storeId: store.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Erro ao excluir o produto." },
      { status: 500 }
    );
  }
}
