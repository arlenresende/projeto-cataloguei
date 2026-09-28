import { NextResponse } from "next/server";
import { requireVerifiedSession } from "@/lib/api-session";
import { createAuditLog } from "@/lib/audit-log";
import {
  BillingAccessError,
  cancelUserStripeSubscription,
  serializeBillingState,
  getUserBillingState,
} from "@/lib/billing/subscription";
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

export async function DELETE(request: Request) {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de cancelar sua assinatura."
  );
  if (session instanceof NextResponse) {
    return session;
  }

  try {
    await cancelUserStripeSubscription(session.user.id);
    const billing = await getUserBillingState(session.user.id);

    await createAuditLog({
      action: "SUBSCRIPTION_CANCELED",
      actor: {
        id: session.user.id,
        email: session.user.email,
      },
      targetType: "SUBSCRIPTION",
      targetId: billing.subscription.id,
      metadata: {
        plan: billing.subscription.plan,
        status: billing.subscription.status,
        stripeSubscriptionId: billing.subscription.stripeSubscriptionId,
        cancelAtPeriodEnd: billing.subscription.cancelAtPeriodEnd,
      },
      request: { headers: request.headers },
    });

    return NextResponse.json({
      success: true,
      billing: serializeBillingState(billing),
    });
  } catch (error) {
    if (error instanceof BillingAccessError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

    if (error instanceof Error && error.message.includes("STRIPE_SECRET_KEY")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.error("Erro ao cancelar assinatura:", error);
    return NextResponse.json(
      { error: "Não foi possível cancelar a assinatura no momento." },
      { status: 500 }
    );
  }
}
