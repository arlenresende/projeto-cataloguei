import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  buildStoreLogoObjectKey,
  extractSupabaseStorageObjectKey,
  StoreLogoValidationError,
  validateStoreLogoFile,
} from "@/lib/store-logo";
import {
  deleteFileFromSupabaseStorage,
  getSupabaseStorageBucketName,
  SUPABASE_STORAGE_CONFIG_ERROR_MESSAGE,
  uploadFileToSupabaseStorage,
} from "@/lib/storage/supabase";

export const runtime = "nodejs";

async function getAuthorizedStore(storeId: string, userId: string) {
  return prisma.store.findFirst({
    where: { id: storeId, userId },
    select: { id: true, logo: true },
  });
}

async function getVerifiedSession() {
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

  return session;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getVerifiedSession();

  if (session instanceof NextResponse) {
    return session;
  }

  const { id } = await params;
  const store = await getAuthorizedStore(id, session.user.id);

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Selecione uma imagem para enviar." },
      { status: 400 }
    );
  }

  try {
    const validatedFile = await validateStoreLogoFile(file);
    const objectKey = buildStoreLogoObjectKey(store.id, validatedFile.kind);
    const uploadedFile = await uploadFileToSupabaseStorage({
      objectKey,
      body: validatedFile.bytes,
      contentType: validatedFile.mimeType,
    });

    try {
      await prisma.store.updateMany({
        where: { id, userId: session.user.id },
        data: { logo: uploadedFile.publicUrl },
      });
    } catch (error) {
      await deleteFileFromSupabaseStorage(uploadedFile.objectKey).catch(() => {
        console.error("Não foi possível limpar a nova logo após erro no banco.");
      });

      throw error;
    }

    if (store.logo) {
      const previousObjectKey = extractSupabaseStorageObjectKey(
        store.logo,
        getSupabaseStorageBucketName()
      );

      if (previousObjectKey && previousObjectKey !== uploadedFile.objectKey) {
        await deleteFileFromSupabaseStorage(previousObjectKey).catch((error) => {
          console.error(
            "Não foi possível remover a logo anterior do Supabase Storage:",
            error
          );
        });
      }
    }

    return NextResponse.json(
      {
        logoUrl: uploadedFile.publicUrl,
        objectKey: uploadedFile.objectKey,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof StoreLogoValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Error) {
      const isConfigurationError =
        error.message === SUPABASE_STORAGE_CONFIG_ERROR_MESSAGE;

      if (!isConfigurationError) {
        console.error("Erro ao enviar logo da loja:", error);
      }

      return NextResponse.json(
        {
          error: isConfigurationError
            ? "O storage da loja ainda não está configurado no servidor."
            : "Não foi possível enviar a logo.",
        },
        { status: 500 }
      );
    }

    console.error("Erro ao enviar logo da loja:", error);

    return NextResponse.json(
      { error: "Não foi possível enviar a logo." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getVerifiedSession();

  if (session instanceof NextResponse) {
    return session;
  }

  const { id } = await params;
  const store = await getAuthorizedStore(id, session.user.id);

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada." }, { status: 404 });
  }

  if (!store.logo) {
    return NextResponse.json({ success: true, logoUrl: null });
  }

  try {
    await prisma.store.updateMany({
      where: { id, userId: session.user.id },
      data: { logo: null },
    });

    const objectKey = extractSupabaseStorageObjectKey(
      store.logo,
      getSupabaseStorageBucketName()
    );

    if (objectKey) {
      await deleteFileFromSupabaseStorage(objectKey).catch((error) => {
        console.error(
          "Não foi possível remover a logo do Supabase Storage:",
          error
        );
      });
    }

    return NextResponse.json({ success: true, logoUrl: null });
  } catch (error) {
    console.error("Erro ao remover logo da loja:", error);

    return NextResponse.json(
      { error: "Não foi possível remover a logo." },
      { status: 500 }
    );
  }
}
