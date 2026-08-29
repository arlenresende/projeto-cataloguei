import { NextResponse } from "next/server";
import { requireVerifiedSession } from "@/lib/api-session";
import { assertAdvancedSeoAccess, BillingAccessError } from "@/lib/billing/subscription";
import { prisma } from "@/lib/prisma";
import { productUpdateSchema } from "@/lib/schemas/product";
import { getPrismaErrorCode, prismaTargetIncludes } from "@/lib/prisma-error";

// GET /api/products/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de acessar produtos."
  );
  if (session instanceof NextResponse) {
    return session;
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
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de editar produtos."
  );
  if (session instanceof NextResponse) {
    return session;
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

  try {
    await assertAdvancedSeoAccess(session.user.id, {
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    });
  } catch (error) {
    if (error instanceof BillingAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    throw error;
  }

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

    const result = await prisma.product.updateMany({
      where: { id, storeId: store.id },
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

    if (result.count === 0) {
      return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    }

    const product = await prisma.product.findFirst({
      where: { id, storeId: store.id },
      include: {
        categoryRel: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { position: "asc" } },
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
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de excluir produtos."
  );
  if (session instanceof NextResponse) {
    return session;
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
    const result = await prisma.product.deleteMany({
      where: { id, storeId: store.id },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Erro ao excluir o produto." },
      { status: 500 }
    );
  }
}
