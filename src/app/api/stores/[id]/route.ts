import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storeSchema } from "@/lib/schemas/store";

// GET /api/stores/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;

  const store = await prisma.store.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ store });
}

// PATCH /api/stores/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.store.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  const body = await request.json();
  const parsed = storeSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Check slug uniqueness if changed
  if (data.slug && data.slug !== existing.slug) {
    const slugTaken = await prisma.store.findUnique({
      where: { slug: data.slug },
    });

    if (slugTaken) {
      return NextResponse.json(
        { error: "Esse endereço já está em uso. Escolha outro." },
        { status: 409 }
      );
    }
  }

  try {
    const store = await prisma.store.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.address !== undefined && { address: data.address || null }),
        ...(data.city !== undefined && { city: data.city || null }),
        ...(data.state !== undefined && { state: data.state || null }),
        ...(data.postalCode !== undefined && { postalCode: data.postalCode || null }),
        ...(data.country !== undefined && { country: data.country || null }),
        ...(data.email !== undefined && { email: data.email || null }),
        ...(data.logo !== undefined && { logo: data.logo || null }),
        ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl || null }),
        ...(data.whatsappUrl !== undefined && { whatsappUrl: data.whatsappUrl || null }),
        ...(data.instagramUrl !== undefined && { instagramUrl: data.instagramUrl || null }),
        ...(data.facebookUrl !== undefined && { facebookUrl: data.facebookUrl || null }),
        ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber || null }),
        ...(data.cellPhone !== undefined && { cellPhone: data.cellPhone || null }),
        ...(data.themeStore !== undefined && { themeStore: data.themeStore as any }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return NextResponse.json({ store });
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar a loja." },
      { status: 500 }
    );
  }
}

// DELETE /api/stores/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.store.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  try {
    await prisma.store.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao excluir a loja." },
      { status: 500 }
    );
  }
}
