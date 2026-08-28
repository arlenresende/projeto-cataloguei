import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storeCreateSchema } from "@/lib/schemas/store";
import {
  buildStoreCreateData,
  getStoreConflictMessage,
  storeAdminSelect,
} from "@/lib/store";

// GET /api/stores — get the authenticated user's store
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    if (!session.user.emailVerified) {
      return NextResponse.json(
        { error: "Verifique seu e-mail para acessar esta área." },
        { status: 403 }
      );
    }

    const store = await prisma.store.findUnique({
      where: { userId: session.user.id },
      select: storeAdminSelect,
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

  if (!session.user.emailVerified) {
    return NextResponse.json(
      { error: "Verifique seu e-mail para acessar esta área." },
      { status: 403 }
    );
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

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Payload inválido." },
      { status: 400 }
    );
  }

  const parsed = storeCreateSchema.safeParse(body);

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
      data: buildStoreCreateData(data, session.user.id),
      select: storeAdminSelect,
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch (error) {
    const conflictMessage = getStoreConflictMessage(error);

    if (conflictMessage) {
      return NextResponse.json({ error: conflictMessage }, { status: 409 });
    }

    console.error("Error creating store:", error);
    return NextResponse.json(
      { error: "Erro ao criar a loja. Tente novamente." },
      { status: 500 }
    );
  }
}
