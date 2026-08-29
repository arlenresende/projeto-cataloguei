import { beforeEach, describe, expect, it, vi } from "vitest";
import { SubscriptionStatus } from "@prisma/client";

const {
  getAsaasSubscriptionMock,
  syncAsaasCustomerIdMock,
  updateSubscriptionSnapshotMock,
  prismaMock,
} = vi.hoisted(() => ({
  getAsaasSubscriptionMock: vi.fn(),
  syncAsaasCustomerIdMock: vi.fn(),
  updateSubscriptionSnapshotMock: vi.fn(),
  prismaMock: {
    asaasWebhookEvent: {
      create: vi.fn(),
    },
    subscription: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/asaas/subscriptions", () => ({
  getAsaasSubscription: getAsaasSubscriptionMock,
}));

vi.mock("@/lib/billing/subscription", () => ({
  syncAsaasCustomerId: syncAsaasCustomerIdMock,
  updateSubscriptionSnapshot: updateSubscriptionSnapshotMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { POST } from "@/app/api/webhooks/asaas/route";
import { ASAAS_WEBHOOK_TOKEN_HEADER } from "@/lib/asaas/webhooks";

const localSubscription = {
  id: "sub_local",
  userId: "user_1",
  status: SubscriptionStatus.PENDING,
  canceledAt: null,
  currentPeriodEnd: null,
  asaasSubscriptionId: "sub_asaas",
};

describe("POST /api/webhooks/asaas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ASAAS_WEBHOOK_TOKEN = "webhook-token";
    prismaMock.asaasWebhookEvent.create.mockResolvedValue({ id: "evt_local" });
    prismaMock.subscription.findFirst.mockResolvedValue(localSubscription);
    prismaMock.subscription.findUnique.mockResolvedValue(localSubscription);
    getAsaasSubscriptionMock.mockResolvedValue({
      customer: "cus_123",
      nextDueDate: "2026-09-30",
    });
  });

  it("ativa o Premium quando recebe pagamento confirmado", async () => {
    const request = new Request("http://localhost:3000/api/webhooks/asaas", {
      method: "POST",
      headers: {
        [ASAAS_WEBHOOK_TOKEN_HEADER]: "webhook-token",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: "evt_1",
        event: "PAYMENT_CONFIRMED",
        payment: {
          id: "pay_1",
          subscription: "sub_asaas",
          customer: "cus_123",
          status: "RECEIVED",
          invoiceUrl: "https://sandbox.asaas.com/i/pay_1",
          confirmedDate: "2026-08-28",
          dueDate: "2026-09-30",
        },
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(syncAsaasCustomerIdMock).toHaveBeenCalledWith("user_1", "cus_123");
    expect(updateSubscriptionSnapshotMock).toHaveBeenCalledWith(
      { id: "sub_local" },
      expect.objectContaining({
        plan: "PREMIUM",
        status: SubscriptionStatus.ACTIVE,
        asaasPaymentId: "pay_1",
      })
    );
  });

  it("marca a assinatura como overdue quando o pagamento vence", async () => {
    const request = new Request("http://localhost:3000/api/webhooks/asaas", {
      method: "POST",
      headers: {
        [ASAAS_WEBHOOK_TOKEN_HEADER]: "webhook-token",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: "evt_2",
        event: "PAYMENT_OVERDUE",
        payment: {
          id: "pay_2",
          subscription: "sub_asaas",
          customer: "cus_123",
          status: "OVERDUE",
          dueDate: "2026-09-30",
        },
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(updateSubscriptionSnapshotMock).toHaveBeenCalledWith(
      { id: "sub_local" },
      expect.objectContaining({
        status: SubscriptionStatus.OVERDUE,
      })
    );
  });

  it("ignora evento duplicado do Asaas sem reprocessar efeitos colaterais", async () => {
    prismaMock.asaasWebhookEvent.create.mockRejectedValueOnce(
      Object.assign(new Error("duplicate"), {
        code: "P2002",
      })
    );

    const request = new Request("http://localhost:3000/api/webhooks/asaas", {
      method: "POST",
      headers: {
        [ASAAS_WEBHOOK_TOKEN_HEADER]: "webhook-token",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: "evt_duplicate",
        event: "PAYMENT_RECEIVED",
        payment: {
          id: "pay_duplicate",
          subscription: "sub_asaas",
          customer: "cus_123",
          status: "RECEIVED",
        },
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true, duplicate: true });
    expect(updateSubscriptionSnapshotMock).not.toHaveBeenCalled();
  });
});
