import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY nao esta definida.");
  }

  stripeClient ??= new Stripe(secretKey);

  return stripeClient;
}

export function getStripePremiumPriceId() {
  const priceId = process.env.STRIPE_PREMIUM_PRICE_ID;

  if (!priceId) {
    throw new Error("STRIPE_PREMIUM_PRICE_ID nao esta definida.");
  }

  return priceId;
}

export function getStripeWebhookSecret() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET nao esta definida.");
  }

  return webhookSecret;
}
