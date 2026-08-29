import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { requireVerifiedSession } from "@/lib/api-session";
import {
  assertAdvancedSeoAccess,
  assertCanCreateProduct,
  BillingAccessError,
} from "@/lib/billing/subscription";
import { prisma } from "@/lib/prisma";
import { productCreateSchema } from "@/lib/schemas/product";
import { getPrismaErrorCode, prismaTargetIncludes } from "@/lib/prisma-error";

// GET /api/products — list products of the user's store
export async function GET(request: Request) {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de acessar produtos."
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

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const search = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category") || "";
  const status = url.searchParams.get("status") || "";
  const stock = url.searchParams.get("stock") || "";

  const where: Prisma.ProductWhereInput = { storeId: store.id };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { barcode: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.categoryId = category;
  }

  if (status === "active") {
    where.active = true;
  } else if (status === "inactive") {
    where.active = false;
  }

  if (stock === "out") {
    where.stock = 0;
  } else if (stock === "low") {
    where.stock = { gt: 0, lte: 5 };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        stock: true,
        minStock: true,
        active: true,
        featured: true,
        imageUrl: true,
        sku: true,
        createdAt: true,
        categoryRel: { select: { id: true, name: true } },
        images: { orderBy: { position: "asc" }, select: { id: true, url: true, alt: true, position: true } },
        _count: { select: { images: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST /api/products — create a product
export async function POST(request: Request) {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de criar produtos."
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

  try {
    await assertCanCreateProduct(session.user.id, store.id);
  } catch (error) {
    if (error instanceof BillingAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    throw error;
  }

  const body = await request.json();
  const parsed = productCreateSchema.safeParse(body);

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
    const product = await prisma.product.create({
      data: {
        storeId: store.id,
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        descriptionHtml: data.descriptionHtml || null,
        sku: data.sku || null,
        barcode: data.barcode || null,
        brand: data.brand || null,
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        stock: data.stock ?? 0,
        minStock: data.minStock || null,
        weight: data.weight || null,
        categoryId: data.categoryId || null,
        category: data.categoryId
          ? (await prisma.category.findUnique({ where: { id: data.categoryId }, select: { name: true } }))?.name || null
          : null,
        featured: data.featured ?? false,
        active: data.active ?? true,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
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
      return NextResponse.json(
        { error: "Dados duplicados. Verifique slug e SKU." },
        { status: 409 }
      );
    }
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Erro ao criar o produto." },
      { status: 500 }
    );
  }
}
