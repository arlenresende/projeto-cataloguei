import { NextResponse } from "next/server";
import { requireVerifiedSession } from "@/lib/api-session";
import { serializeBillingState, getUserBillingState } from "@/lib/billing/subscription";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/site-config";
import { getStripe } from "@/lib/stripe";

export async function GET() {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de consultar seu plano."
  );
  if (session instanceof NextResponse) {
    return session;
  }

  const billing = await getUserBillingState(session.user.id);
  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    select: { id: true, primaryColor: true, secondaryColor: true, hideCatalogueiBranding: true },
  });

  const [productCount, activeBannerCount] = store
    ? await Promise.all([
        prisma.product.count({ where: { storeId: store.id } }),
        prisma.storeHero.count({ where: { storeId: store.id, isActive: true } }),
      ])
    : [0, 0];

  return NextResponse.json({
    billing: serializeBillingState(billing),
    usage: {
      products: productCount,
      activeBanners: activeBannerCount,
      hasAdvancedCustomization:
        Boolean(store?.primaryColor) || Boolean(store?.secondaryColor),
      hideCatalogueiBranding: Boolean(store?.hideCatalogueiBranding),
    },
  });
}

export async function POST() {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de gerenciar sua assinatura."
  );
  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const billing = await getUserBillingState(session.user.id);

    if (
      billing.subscription.plan !== "PREMIUM" ||
      !billing.subscription.stripeCustomerId
    ) {
      return NextResponse.json(
        { error: "Nenhuma assinatura Premium foi encontrada para gerenciamento." },
        { status: 404 }
      );
    }

    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: billing.subscription.stripeCustomerId,
      return_url: absoluteUrl("/admin/plans"),
    });

    return NextResponse.json({
      portalUrl: portalSession.url,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("STRIPE_SECRET_KEY")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.error("Erro ao criar portal de assinatura:", error);
    return NextResponse.json(
      { error: "Não foi possível abrir o portal de assinatura no momento." },
      { status: 500 }
    );
  }
}
