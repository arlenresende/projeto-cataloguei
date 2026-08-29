import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import type Stripe from "stripe";
import {
  markStripeSubscriptionPaymentFailed,
  resetCanceledStripeSubscription,
  syncStripeSubscription,
} from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Assinatura do webhook ausente." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      getStripeWebhookSecret()
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook Stripe invalido.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    await prisma.stripeWebhookEvent.create({
      data: {
        eventId: event.id,
        eventType: event.type,
        payload: event as unknown as object,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    throw error;
  }

  try {
    await handleStripeEvent(event);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro ao processar webhook Stripe:", error);
    return NextResponse.json(
      { error: "Nao foi possivel processar o webhook." },
      { status: 500 }
    );
  }
}

async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const stripeSubscriptionId =
        typeof checkoutSession.subscription === "string"
          ? checkoutSession.subscription
          : checkoutSession.subscription?.id;

      if (!stripeSubscriptionId) {
        return;
      }

      const subscription = await getStripe().subscriptions.retrieve(
        stripeSubscriptionId,
        { expand: ["items.data.price"] }
      );
      await syncStripeSubscription(subscription);
      return;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      await syncStripeSubscription(event.data.object as Stripe.Subscription);
      return;
    }
    case "customer.subscription.deleted": {
      await resetCanceledStripeSubscription(
        event.data.object as Stripe.Subscription
      );
      return;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const stripeSubscriptionId = getInvoiceSubscriptionId(invoice);

      if (!stripeSubscriptionId) {
        return;
      }

      const subscription = await getStripe().subscriptions.retrieve(
        stripeSubscriptionId,
        { expand: ["items.data.price"] }
      );
      await syncStripeSubscription(subscription);
      return;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await markStripeSubscriptionPaymentFailed(getInvoiceSubscriptionId(invoice));
      return;
    }
    default:
      return;
  }
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice) {
  const subscription = invoice.parent?.subscription_details?.subscription;
  return typeof subscription === "string" ? subscription : subscription?.id ?? null;
}
