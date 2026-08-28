import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/products/[id]/images/[imageId]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id, imageId } = await params;

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  const product = await prisma.product.findFirst({
    where: { id, storeId: store.id },
    select: { id: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId: id },
  });

  if (!image) {
    return NextResponse.json({ error: "Imagem não encontrada." }, { status: 404 });
  }

  await prisma.productImage.delete({ where: { id: imageId } });

  // Update product imageUrl to new first image
  const firstImage = await prisma.productImage.findFirst({
    where: { productId: id },
    orderBy: { position: "asc" },
    select: { url: true },
  });

  await prisma.product.update({
    where: { id },
    data: { imageUrl: firstImage?.url || null },
  });

  return NextResponse.json({ success: true });
}
