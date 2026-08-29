import { NextResponse } from "next/server";
import { requireVerifiedSession } from "@/lib/api-session";
import {
  ensureStripeCustomerForUser,
  STRIPE_PREMIUM_SUBSCRIPTION_METADATA,
} from "@/lib/billing/stripe";
import { getUserBillingState, serializeBillingState } from "@/lib/billing/subscription";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/site-config";
import { getStripe, getStripePremiumPriceId } from "@/lib/stripe";

export async function POST() {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de contratar o Premium."
  );
  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const billing = await getUserBillingState(session.user.id);

    if (billing.isPremium) {
      return NextResponse.json(
        { error: "Sua assinatura Premium já está ativa." },
        { status: 409 }
      );
    }

    const stripe = getStripe();
    const priceId = getStripePremiumPriceId();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });
    const stripeCustomerId = await ensureStripeCustomerForUser({
      userId: session.user.id,
      name: session.user.name,
      email: session.user.email,
      existingCustomerId:
        billing.subscription.stripeCustomerId || user?.stripeCustomerId || null,
      stripe,
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      client_reference_id: session.user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: absoluteUrl("/admin/plans?payment=success"),
      cancel_url: absoluteUrl("/admin/plans?payment=canceled"),
      subscription_data: {
        metadata: {
          userId: session.user.id,
          ...STRIPE_PREMIUM_SUBSCRIPTION_METADATA,
        },
      },
      metadata: {
        userId: session.user.id,
        ...STRIPE_PREMIUM_SUBSCRIPTION_METADATA,
      },
    });

    const refreshed = await getUserBillingState(session.user.id);

    return NextResponse.json(
      {
        checkoutUrl: checkoutSession.url,
        billing: serializeBillingState(refreshed),
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("STRIPE_SECRET_KEY") ||
        error.message.includes("STRIPE_PREMIUM_PRICE_ID"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.error("Erro ao contratar Premium:", error);
    return NextResponse.json(
      { error: "Não foi possível iniciar a assinatura Premium." },
      { status: 500 }
    );
  }
}
