import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireVerifiedSession } from "@/lib/api-session";
import { getUserBillingState } from "@/lib/billing/subscription";
import { sendFeatureRequestCreatedEmail } from "@/lib/email";
import {
  createFeatureRequest,
  isAdminUser,
  listFeatureRequests,
} from "@/lib/feature-requests";

const createRequestSchema = z.object({
  title: z.string().trim().min(5).max(120),
  description: z.string().trim().min(20).max(2000),
});

export async function GET() {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de acessar suas solicitações."
  );
  if (session instanceof NextResponse) {
    return session;
  }

  const isAdmin = await isAdminUser({
    userId: session.user.id,
    email: session.user.email,
  });
  const requests = await listFeatureRequests({
    userId: session.user.id,
    isAdmin,
  });

  return NextResponse.json({ requests, isAdmin });
}

export async function POST(request: Request) {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de enviar uma solicitação."
  );
  if (session instanceof NextResponse) {
    return session;
  }

  const billing = await getUserBillingState(session.user.id);

  if (!billing.isPremium) {
    return NextResponse.json(
      { error: "Solicitações de novas possibilidades são exclusivas do Premium." },
      { status: 403 }
    );
  }

  let input: z.infer<typeof createRequestSchema>;

  try {
    input = createRequestSchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Informe um título e uma descrição mais detalhada." },
      { status: 400 }
    );
  }

  const featureRequest = await createFeatureRequest({
    id: randomUUID(),
    userId: session.user.id,
    title: input.title,
    description: input.description,
  });

  try {
    await sendFeatureRequestCreatedEmail({
      email: session.user.email,
      name: session.user.name,
      title: input.title,
    });
  } catch (error) {
    console.error("[feature-request] Falha ao enviar e-mail de criação", error);
  }

  return NextResponse.json({ request: featureRequest }, { status: 201 });
}
