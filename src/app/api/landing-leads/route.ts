import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { landingLeadSchema } from "@/lib/schemas/landing-lead";

function nullableText(value: string | null | undefined) {
  return value?.trim() || null;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const parsed = landingLeadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const source = nullableText(data.source) || "catalogo-online";

  const lead = await prisma.landingLead.upsert({
    where: {
      whatsapp_source: {
        whatsapp: data.whatsapp,
        source,
      },
    },
    update: {
      name: data.name,
      email: nullableText(data.email),
      businessType: nullableText(data.businessType),
      currentSalesChannel: nullableText(data.currentSalesChannel),
      monthlyOrders: nullableText(data.monthlyOrders),
      message: nullableText(data.message),
      utmSource: nullableText(data.utmSource),
      utmMedium: nullableText(data.utmMedium),
      utmCampaign: nullableText(data.utmCampaign),
      utmTerm: nullableText(data.utmTerm),
      utmContent: nullableText(data.utmContent),
    },
    create: {
      name: data.name,
      email: nullableText(data.email),
      whatsapp: data.whatsapp,
      businessType: nullableText(data.businessType),
      currentSalesChannel: nullableText(data.currentSalesChannel),
      monthlyOrders: nullableText(data.monthlyOrders),
      message: nullableText(data.message),
      source,
      utmSource: nullableText(data.utmSource),
      utmMedium: nullableText(data.utmMedium),
      utmCampaign: nullableText(data.utmCampaign),
      utmTerm: nullableText(data.utmTerm),
      utmContent: nullableText(data.utmContent),
    },
    select: { id: true },
  });

  return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
}
