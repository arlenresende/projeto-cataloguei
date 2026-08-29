import "server-only";

import { SubscriptionStatus } from "@prisma/client";

export const ASAAS_WEBHOOK_TOKEN_HEADER = "asaas-access-token";

export type AsaasWebhookEventSource = "payment" | "subscription" | "unknown";

export type AsaasWebhookPayload = {
  id: string;
  event: string;
  dateCreated?: string;
  payment?: {
    id: string;
    subscription?: string | null;
    customer: string;
    status: string;
    invoiceUrl?: string | null;
    billingType?: string | null;
    paymentDate?: string | null;
    clientPaymentDate?: string | null;
    confirmedDate?: string | null;
    dueDate?: string | null;
    value?: number | null;
  };
  subscription?: {
    id: string;
    customer: string;
    status: string;
    nextDueDate?: string | null;
    cycle?: string | null;
    value?: number | null;
    billingType?: string | null;
    externalReference?: string | null;
    deleted?: boolean;
  };
};

export function getAsaasWebhookSecret() {
  return process.env.ASAAS_WEBHOOK_TOKEN || "";
}

export function validateAsaasWebhookToken(receivedToken: string | null) {
  const expectedToken = getAsaasWebhookSecret();

  if (!expectedToken) {
    throw new Error(
      "ASAAS_WEBHOOK_TOKEN não está definido. Configure o token do webhook no servidor."
    );
  }

  return receivedToken === expectedToken;
}

export function getAsaasWebhookSource(
  payload: Partial<AsaasWebhookPayload>
): AsaasWebhookEventSource {
  if (payload.payment) {
    return "payment";
  }

  if (payload.subscription) {
    return "subscription";
  }

  return "unknown";
}

export function mapPaymentEventToSubscriptionStatus(event: string) {
  switch (event) {
    case "PAYMENT_CONFIRMED":
    case "PAYMENT_RECEIVED":
      return SubscriptionStatus.ACTIVE;
    case "PAYMENT_OVERDUE":
      return SubscriptionStatus.OVERDUE;
    case "PAYMENT_DELETED":
    case "PAYMENT_REFUNDED":
    case "PAYMENT_PARTIALLY_REFUNDED":
    case "PAYMENT_REFUND_IN_PROGRESS":
    case "PAYMENT_RECEIVED_IN_CASH_UNDONE":
    case "PAYMENT_CREDIT_CARD_CAPTURE_REFUSED":
    case "PAYMENT_REPROVED_BY_RISK_ANALYSIS":
    case "PAYMENT_CHARGEBACK_REQUESTED":
    case "PAYMENT_CHARGEBACK_DISPUTE":
    case "PAYMENT_AWAITING_CHARGEBACK_REVERSAL":
      return SubscriptionStatus.CANCELED;
    case "PAYMENT_CREATED":
    case "PAYMENT_UPDATED":
    case "PAYMENT_RESTORED":
    case "PAYMENT_AWAITING_RISK_ANALYSIS":
    case "PAYMENT_APPROVED_BY_RISK_ANALYSIS":
    case "PAYMENT_AUTHORIZED":
    case "PAYMENT_BANK_SLIP_VIEWED":
    case "PAYMENT_CHECKOUT_VIEWED":
      return SubscriptionStatus.PENDING;
    default:
      return null;
  }
}

export function mapSubscriptionEventToSubscriptionStatus(
  event: string,
  remoteStatus?: string | null
) {
  if (remoteStatus === "ACTIVE") {
    return SubscriptionStatus.ACTIVE;
  }

  if (remoteStatus === "INACTIVE" || remoteStatus === "EXPIRED") {
    return SubscriptionStatus.INACTIVE;
  }

  switch (event) {
    case "SUBSCRIPTION_INACTIVATED":
      return SubscriptionStatus.INACTIVE;
    case "SUBSCRIPTION_DELETED":
      return SubscriptionStatus.CANCELED;
    case "SUBSCRIPTION_CREATED":
    case "SUBSCRIPTION_UPDATED":
      return SubscriptionStatus.PENDING;
    default:
      return null;
  }
}

export function parseAsaasDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.includes("T")
    ? value
    : value.includes(" ")
      ? value.replace(" ", "T")
      : `${value}T00:00:00`;

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
