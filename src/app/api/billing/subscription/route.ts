import { NextResponse } from "next/server";
import { cancelAsaasSubscription } from "@/lib/asaas/subscriptions";
import { requireVerifiedSession } from "@/lib/api-session";
import { serializeBillingState, getUserBillingState, updateSubscriptionSnapshot } from "@/lib/billing/subscription";
import { prisma } from "@/lib/prisma";

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

export async function DELETE() {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de cancelar sua assinatura."
  );
  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const billing = await getUserBillingState(session.user.id);

    if (
      billing.subscription.plan !== "PREMIUM" ||
      !billing.subscription.asaasSubscriptionId
    ) {
      return NextResponse.json(
        { error: "Nenhuma assinatura Premium foi encontrada para cancelamento." },
        { status: 404 }
      );
    }

    await cancelAsaasSubscription(billing.subscription.asaasSubscriptionId);

    const now = new Date();
    const keepAccessUntilPeriodEnd =
      billing.subscription.currentPeriodEnd &&
      billing.subscription.currentPeriodEnd.getTime() > now.getTime();

    await updateSubscriptionSnapshot(
      { userId: session.user.id },
      {
        canceledAt: now,
        latestInvoiceUrl: null,
        latestPaymentStatus: "CANCELED",
        status: keepAccessUntilPeriodEnd ? "ACTIVE" : "CANCELED",
      }
    );

    const refreshed = await getUserBillingState(session.user.id);

    return NextResponse.json({
      success: true,
      billing: serializeBillingState(refreshed),
    });
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    return NextResponse.json(
      { error: "Não foi possível cancelar a assinatura no momento." },
      { status: 500 }
    );
  }
}
