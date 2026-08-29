import { NextResponse } from "next/server";
import { requireVerifiedSession } from "@/lib/api-session";
import { assertCanAddProductImage, BillingAccessError } from "@/lib/billing/subscription";
import { prisma } from "@/lib/prisma";
import {
  buildProductImageObjectKey,
  ProductImageValidationError,
  validateProductImageFile,
} from "@/lib/product-image";
import {
  SUPABASE_STORAGE_CONFIG_ERROR_MESSAGE,
  uploadFileToSupabaseStorage,
  deleteFileFromSupabaseStorage,
} from "@/lib/storage/supabase";

// POST /api/products/[id]/images — add image to product
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de enviar imagens de produto."
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
    select: { id: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  try {
    await assertCanAddProductImage(session.user.id, id);
  } catch (error) {
    if (error instanceof BillingAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    throw error;
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const file = formData.get("file");
  const altValue = formData.get("alt");
  const alt = typeof altValue === "string" ? altValue.trim() : null;

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Selecione uma imagem para enviar." },
      { status: 400 }
    );
  }

  try {
    const validatedFile = await validateProductImageFile(file);
    const objectKey = buildProductImageObjectKey(
      store.id,
      id,
      validatedFile.kind
    );
    const uploadedFile = await uploadFileToSupabaseStorage({
      objectKey,
      body: validatedFile.bytes,
      contentType: validatedFile.mimeType,
    });

    const maxPos = await prisma.productImage.aggregate({
      where: { productId: id },
      _max: { position: true },
    });

    let image;

    try {
      image = await prisma.productImage.create({
        data: {
          productId: id,
          url: uploadedFile.publicUrl,
          alt: alt || null,
          position: (maxPos._max.position ?? -1) + 1,
        },
      });
    } catch (error) {
      await deleteFileFromSupabaseStorage(uploadedFile.objectKey).catch(() => {
        console.error(
          "Não foi possível limpar a nova imagem do produto após erro no banco."
        );
      });

      throw error;
    }

    const imageCount = await prisma.productImage.count({ where: { productId: id } });
    if (imageCount === 1) {
      await prisma.product.updateMany({
        where: { id, storeId: store.id },
        data: { imageUrl: uploadedFile.publicUrl },
      });
    }

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    if (error instanceof ProductImageValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Error) {
      const isConfigurationError =
        error.message === SUPABASE_STORAGE_CONFIG_ERROR_MESSAGE;

      if (!isConfigurationError) {
        console.error("Erro ao enviar imagem do produto:", error);
      }

      return NextResponse.json(
        {
          error: isConfigurationError
            ? "O storage de imagens ainda não está configurado no servidor."
            : "Não foi possível enviar a imagem.",
        },
        { status: 500 }
      );
    }

    console.error("Erro ao enviar imagem do produto:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar a imagem." },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id]/images — reorder images
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de reorganizar imagens de produto."
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
    select: { id: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  const body = await request.json();
  const { images } = body;

  if (!Array.isArray(images)) {
    return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
  }

  await prisma.$transaction(
    images.map((img: { id: string; position: number }) =>
      prisma.productImage.updateMany({
        where: { id: img.id, productId: id },
        data: { position: img.position },
      })
    )
  );

  // Update product imageUrl to first image
  const firstImage = await prisma.productImage.findFirst({
    where: { productId: id },
    orderBy: { position: "asc" },
    select: { url: true },
  });

  if (firstImage) {
    await prisma.product.updateMany({
      where: { id, storeId: store.id },
      data: { imageUrl: firstImage.url },
    });
  }

  return NextResponse.json({ success: true });
}
