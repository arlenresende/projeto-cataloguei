import "server-only";

import { Plan, SubscriptionStatus } from "@prisma/client";
import type Stripe from "stripe";
import { PREMIUM_MONTHLY_PRICE } from "@/lib/billing/plans";
import {
  ensureUserSubscription,
  syncStripeCustomerId,
  upsertPremiumSubscription,
} from "@/lib/billing/subscription";
import { prisma } from "@/lib/prisma";

export function mapStripeSubscriptionStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case "active":
    case "trialing":
      return SubscriptionStatus.ACTIVE;
    case "past_due":
    case "unpaid":
      return SubscriptionStatus.OVERDUE;
    case "incomplete":
    case "incomplete_expired":
    case "paused":
      return SubscriptionStatus.PENDING;
    case "canceled":
      return SubscriptionStatus.CANCELED;
    default:
      return SubscriptionStatus.INACTIVE;
  }
}

function unixToDate(value: number | null | undefined) {
  return value ? new Date(value * 1000) : null;
}

function getSubscriptionPeriod(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];

  return {
    currentPeriodStart: unixToDate(item?.current_period_start),
    currentPeriodEnd: unixToDate(item?.current_period_end),
  };
}

function getCustomerId(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null) {
  return typeof customer === "string" ? customer : customer?.id ?? null;
}

export async function syncStripeSubscription(subscription: Stripe.Subscription) {
  const stripeCustomerId = getCustomerId(subscription.customer);
  const userId = subscription.metadata.userId;
  const stripePriceId = subscription.items.data[0]?.price.id;

  if (!stripeCustomerId || !userId || !stripePriceId) {
    return null;
  }

  await ensureUserSubscription(userId);
  const { currentPeriodStart, currentPeriodEnd } =
    getSubscriptionPeriod(subscription);

  return upsertPremiumSubscription(userId, {
    stripeCustomerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId,
    status: mapStripeSubscriptionStatus(subscription.status),
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: unixToDate(subscription.canceled_at),
  });
}

export async function markStripeSubscriptionPaymentFailed(
  subscriptionId: string | null
) {
  if (!subscriptionId) {
    return null;
  }

  return prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: SubscriptionStatus.OVERDUE },
  });
}

export async function resetCanceledStripeSubscription(subscription: Stripe.Subscription) {
  const stripeCustomerId = getCustomerId(subscription.customer);

  return prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      plan: Plan.FREE,
      status: SubscriptionStatus.CANCELED,
      price: 0,
      stripeCustomerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0]?.price.id ?? null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
      canceledAt: unixToDate(subscription.canceled_at) ?? new Date(),
      cancelAtPeriodEnd: false,
    },
  });
}

export async function ensureStripeCustomerForUser(input: {
  userId: string;
  name: string;
  email: string;
  existingCustomerId?: string | null;
  stripe: Stripe;
}) {
  if (input.existingCustomerId) {
    return input.existingCustomerId;
  }

  const customer = await input.stripe.customers.create({
    name: input.name,
    email: input.email,
    metadata: {
      userId: input.userId,
    },
  });

  await ensureUserSubscription(input.userId);
  await syncStripeCustomerId(input.userId, customer.id);

  return customer.id;
}

export const STRIPE_PREMIUM_SUBSCRIPTION_METADATA = {
  plan: "PREMIUM",
  billingCycle: "MONTHLY",
  price: String(PREMIUM_MONTHLY_PRICE),
} as const;
