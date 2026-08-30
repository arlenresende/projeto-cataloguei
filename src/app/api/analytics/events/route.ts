import { createHash, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { AnalyticsEventType } from "@/lib/analytics/client";
import { prisma } from "@/lib/prisma";

const ANALYTICS_EVENT_TYPES = [
  "STORE_VIEW",
  "PRODUCT_VIEW",
  "CATEGORY_VIEW",
  "LINKTREE_VIEW",
  "WHATSAPP_CLICK",
  "PRODUCT_WHATSAPP_CLICK",
  "SHARE_CLICK",
  "LINKTREE_LINK_CLICK",
] as const;

const analyticsEventSchema = z.object({
  type: z.enum(ANALYTICS_EVENT_TYPES),
  storeSlug: z.string().min(1).max(120),
  productId: z.string().min(1).max(120).optional(),
  categorySlug: z.string().min(1).max(160).optional(),
  linkId: z.string().min(1).max(120).optional(),
  path: z.string().max(500).optional().nullable(),
  referrer: z.string().max(500).optional().nullable(),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

const PRODUCT_EVENTS = new Set<AnalyticsEventType>([
  "PRODUCT_VIEW",
  "PRODUCT_WHATSAPP_CLICK",
  "SHARE_CLICK",
]);

const CATEGORY_EVENTS = new Set<AnalyticsEventType>([
  "CATEGORY_VIEW",
]);

const LINK_EVENTS = new Set<AnalyticsEventType>([
  "LINKTREE_LINK_CLICK",
]);

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    null
  );
}

function hashIp(ip: string | null) {
  if (!ip) {
    return null;
  }

  const salt =
    process.env.ANALYTICS_IP_SALT ||
    process.env.BETTER_AUTH_SECRET ||
    "cataloguei-analytics";

  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function POST(request: Request) {
  let input: z.infer<typeof analyticsEventSchema>;

  try {
    input = analyticsEventSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Evento invalido." }, { status: 400 });
  }

  const store = await prisma.store.findUnique({
    where: { slug: input.storeSlug },
    select: { id: true, userId: true, isActive: true },
  });

  if (!store?.isActive) {
    return NextResponse.json({ tracked: false });
  }

  const product = input.productId
    ? await prisma.product.findFirst({
        where: {
          id: input.productId,
          storeId: store.id,
          active: true,
        },
        select: { id: true },
      })
    : null;
  const category = input.categorySlug
    ? await prisma.category.findFirst({
        where: {
          slug: input.categorySlug,
          storeId: store.id,
          isActive: true,
        },
        select: { id: true },
      })
    : null;
  const link = input.linkId
    ? await prisma.link.findFirst({
        where: {
          id: input.linkId,
          linktree: {
            userId: store.userId,
          },
        },
        select: { id: true },
      })
    : null;

  if (PRODUCT_EVENTS.has(input.type) && !product) {
    return NextResponse.json({ error: "Produto invalido." }, { status: 400 });
  }

  if (CATEGORY_EVENTS.has(input.type) && !category) {
    return NextResponse.json({ error: "Categoria invalida." }, { status: 400 });
  }

  if (LINK_EVENTS.has(input.type) && !link) {
    return NextResponse.json({ error: "Link invalido." }, { status: 400 });
  }

  const eventId = randomUUID();
  const metadata = input.metadata ? JSON.stringify(input.metadata) : null;

  await prisma.$executeRaw`
    INSERT INTO "analytics_events" (
      "id",
      "storeId",
      "productId",
      "categoryId",
      "linkId",
      "type",
      "path",
      "referrer",
      "userAgent",
      "ipHash",
      "metadata",
      "createdAt"
    )
    VALUES (
      ${eventId},
      ${store.id},
      ${product?.id ?? null},
      ${category?.id ?? null},
      ${link?.id ?? null},
      ${input.type}::"AnalyticsEventType",
      ${input.path || null},
      ${input.referrer || null},
      ${request.headers.get("user-agent")},
      ${hashIp(getClientIp(request))},
      ${metadata}::jsonb,
      NOW()
    )
  `;

  return NextResponse.json({ tracked: true });
}
