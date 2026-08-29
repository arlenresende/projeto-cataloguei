import "server-only";

import { asaasRequest } from "@/lib/asaas/client";
import type { AsaasPaymentListResponse } from "@/lib/asaas/payments";

export type AsaasSubscription = {
  id: string;
  customer: string;
  value: number;
  nextDueDate: string;
  cycle: string;
  description?: string | null;
  billingType: string;
  status: string;
  deleted?: boolean;
  externalReference?: string | null;
};

export async function createAsaasSubscription(input: {
  customer: string;
  billingType: "CREDIT_CARD" | "UNDEFINED" | "PIX" | "BOLETO";
  value: number;
  nextDueDate: string;
  description: string;
  externalReference: string;
  callback?: {
    successUrl: string;
    autoRedirect?: boolean;
  };
}) {
  return asaasRequest<AsaasSubscription>("/subscriptions", {
    method: "POST",
    body: {
      customer: input.customer,
      billingType: input.billingType,
      value: input.value,
      nextDueDate: input.nextDueDate,
      cycle: "MONTHLY",
      description: input.description,
      externalReference: input.externalReference,
      callback: input.callback,
    },
  });
}

export async function getAsaasSubscription(asaasSubscriptionId: string) {
  return asaasRequest<AsaasSubscription>(
    `/subscriptions/${asaasSubscriptionId}`
  );
}

export async function listAsaasSubscriptionPayments(asaasSubscriptionId: string) {
  return asaasRequest<AsaasPaymentListResponse>(
    `/subscriptions/${asaasSubscriptionId}/payments`
  );
}

export async function cancelAsaasSubscription(asaasSubscriptionId: string) {
  return asaasRequest<{ deleted: boolean; id: string }>(
    `/subscriptions/${asaasSubscriptionId}`,
    {
      method: "DELETE",
    }
  );
}
