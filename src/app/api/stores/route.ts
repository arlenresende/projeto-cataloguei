import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createStoreSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(50, "O nome deve ter no máximo 50 caracteres."),
  slug: z
    .string()
    .min(2, "O endereço deve ter pelo menos 2 caracteres.")
    .max(40, "O endereço deve ter no máximo 40 caracteres.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas, números e hífens."
    ),
  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres.")
    .max(200, "A descrição deve ter no máximo 200 caracteres."),
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createStoreSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { name, slug, description } = parsed.data;

  // Check if user already has a store
  const existingStore = await prisma.store.findUnique({
    where: { ownerId: session.user.id },
  });

  if (existingStore) {
    return NextResponse.json(
      { error: "Você já possui uma loja." },
      { status: 409 }
    );
  }

  // Check if slug is taken
  const slugTaken = await prisma.store.findUnique({
    where: { slug },
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
        name,
        slug,
        description,
        theme: "DEFAULT",
        ownerId: session.user.id,
      },
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar a loja. Tente novamente." },
      { status: 500 }
    );
  }
}
