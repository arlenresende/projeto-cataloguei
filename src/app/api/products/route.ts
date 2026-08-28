import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productCreateSchema } from "@/lib/schemas/product";

// GET /api/products — list products of the user's store
export async function GET(request: Request) {
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

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const search = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category") || "";
  const status = url.searchParams.get("status") || "";
  const stock = url.searchParams.get("stock") || "";

  const where: any = { storeId: store.id };

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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (!session.user.emailVerified) {
    return NextResponse.json(
      { error: "Verifique seu e-mail antes de criar produtos." },
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
  const parsed = productCreateSchema.safeParse(body);

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
    if (error instanceof Error && "code" in error && (error as any).code === "P2002") {
      const target = (error as any).meta?.target;
      if (target?.includes("slug")) {
        return NextResponse.json(
          { error: "Já existe um produto com esse slug nesta loja." },
          { status: 409 }
        );
      }
      if (target?.includes("sku")) {
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
