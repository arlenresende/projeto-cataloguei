import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storeSchema } from "@/lib/schemas/store";

// GET /api/stores — get the authenticated user's store
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const store = await prisma.store.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ store });
  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json({ error: "Erro ao buscar loja." }, { status: 500 });
  }
}

// POST /api/stores — create a store (only if user doesn't have one)
export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  // Check if user already has a store
  const existingStore = await prisma.store.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (existingStore) {
    return NextResponse.json(
      { error: "Você já possui uma loja cadastrada." },
      { status: 409 }
    );
  }

  const body = await request.json();
  const parsed = storeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Check if slug is taken
  const slugTaken = await prisma.store.findUnique({
    where: { slug: data.slug },
  });

  if (slugTaken) {
    return NextResponse.json(
      { error: "Esse endereço já está em uso. Escolha outro." },
      { status: 409 }
    );
  }

  try {
    const store = await prisma.store.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        postalCode: data.postalCode || null,
        country: data.country || null,
        email: data.email || null,
        logo: data.logo || null,
        websiteUrl: data.websiteUrl || null,
        whatsappUrl: data.whatsappUrl || null,
        instagramUrl: data.instagramUrl || null,
        facebookUrl: data.facebookUrl || null,
        phoneNumber: data.phoneNumber || null,
        cellPhone: data.cellPhone || null,
        themeStore: (data.themeStore as any) || "DEFAULT",
        isActive: data.isActive ?? true,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch (error) {
    console.error("Error creating store:", error);
    return NextResponse.json(
      { error: "Erro ao criar a loja. Tente novamente." },
      { status: 500 }
    );
  }
}
