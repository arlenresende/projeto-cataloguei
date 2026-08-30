import { NextResponse } from "next/server";
import { z } from "zod";
import { requireVerifiedSession } from "@/lib/api-session";
import {
  sendFeatureRequestDoneEmail,
  sendFeatureRequestInProgressEmail,
} from "@/lib/email";
import {
  isAdminUser,
  updateFeatureRequestStatus,
  type FeatureRequestStatus,
} from "@/lib/feature-requests";

const updateRequestSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "DONE"]),
  adminNote: z.string().trim().max(1000).optional().nullable(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de atualizar solicitações."
  );
  if (session instanceof NextResponse) {
    return session;
  }

  const isAdmin = await isAdminUser({
    userId: session.user.id,
    email: session.user.email,
  });

  if (!isAdmin) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  let input: z.infer<typeof updateRequestSchema>;

  try {
    input = updateRequestSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  const { id } = await params;
  const featureRequest = await updateFeatureRequestStatus({
    id,
    status: input.status as FeatureRequestStatus,
    adminNote: input.adminNote || null,
  });

  if (!featureRequest) {
    return NextResponse.json(
      { error: "Solicitação não encontrada." },
      { status: 404 }
    );
  }

  try {
    if (featureRequest.status === "IN_PROGRESS") {
      await sendFeatureRequestInProgressEmail({
        email: featureRequest.userEmail,
        name: featureRequest.userName,
        title: featureRequest.title,
        adminNote: featureRequest.adminNote,
      });
    }

    if (featureRequest.status === "DONE") {
      await sendFeatureRequestDoneEmail({
        email: featureRequest.userEmail,
        name: featureRequest.userName,
        title: featureRequest.title,
        adminNote: featureRequest.adminNote,
      });
    }
  } catch (error) {
    console.error("[feature-request] Falha ao enviar e-mail de status", error);
  }

  return NextResponse.json({ request: featureRequest });
}
