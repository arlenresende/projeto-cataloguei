import { NextResponse } from "next/server";
import { requireVerifiedSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";
import { extractSupabaseStorageObjectKey } from "@/lib/store-logo";
import {
  deleteFileFromSupabaseStorage,
  getSupabaseStorageBucketName,
} from "@/lib/storage/supabase";

// DELETE /api/products/[id]/images/[imageId]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de remover imagens de produto."
  );
  if (session instanceof NextResponse) {
    return session;
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

  const deleteResult = await prisma.productImage.deleteMany({
    where: { id: imageId, productId: id },
  });

  if (deleteResult.count === 0) {
    return NextResponse.json({ error: "Imagem não encontrada." }, { status: 404 });
  }

  const objectKey = extractSupabaseStorageObjectKey(
    image.url,
    getSupabaseStorageBucketName()
  );

  if (objectKey) {
    await deleteFileFromSupabaseStorage(objectKey).catch((error) => {
      console.error(
        "Não foi possível remover a imagem do produto do Supabase Storage:",
        error
      );
    });
  }

  // Update product imageUrl to new first image
  const firstImage = await prisma.productImage.findFirst({
    where: { productId: id },
    orderBy: { position: "asc" },
    select: { url: true },
  });

  await prisma.product.updateMany({
    where: { id, storeId: store.id },
    data: { imageUrl: firstImage?.url || null },
  });

  return NextResponse.json({ success: true });
}
