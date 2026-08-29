import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

const {
  requireVerifiedSessionMock,
  getUserBillingStateMock,
  serializeBillingStateMock,
  syncAsaasCustomerIdMock,
  updateSubscriptionSnapshotMock,
  upsertPremiumSubscriptionMock,
  createAsaasCustomerMock,
  createAsaasSubscriptionMock,
  listAsaasSubscriptionPaymentsMock,
  absoluteUrlMock,
  prismaMock,
} = vi.hoisted(() => ({
  requireVerifiedSessionMock: vi.fn(),
  getUserBillingStateMock: vi.fn(),
  serializeBillingStateMock: vi.fn((value) => value),
  syncAsaasCustomerIdMock: vi.fn(),
  updateSubscriptionSnapshotMock: vi.fn(),
  upsertPremiumSubscriptionMock: vi.fn(),
  createAsaasCustomerMock: vi.fn(),
  createAsaasSubscriptionMock: vi.fn(),
  listAsaasSubscriptionPaymentsMock: vi.fn(),
  absoluteUrlMock: vi.fn((path: string) => `http://localhost:3000${path}`),
  prismaMock: {
    store: {
      findUnique: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/api-session", () => ({
  requireVerifiedSession: requireVerifiedSessionMock,
}));

vi.mock("@/lib/billing/subscription", () => ({
  getUserBillingState: getUserBillingStateMock,
  serializeBillingState: serializeBillingStateMock,
  syncAsaasCustomerId: syncAsaasCustomerIdMock,
  updateSubscriptionSnapshot: updateSubscriptionSnapshotMock,
  upsertPremiumSubscription: upsertPremiumSubscriptionMock,
}));

vi.mock("@/lib/asaas/customers", () => ({
  createAsaasCustomer: createAsaasCustomerMock,
}));

vi.mock("@/lib/asaas/subscriptions", () => ({
  createAsaasSubscription: createAsaasSubscriptionMock,
  listAsaasSubscriptionPayments: listAsaasSubscriptionPaymentsMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("@/lib/site-config", () => ({
  absoluteUrl: absoluteUrlMock,
}));

import { POST } from "@/app/api/billing/subscribe/route";

function makeBillingState(overrides: Record<string, unknown> = {}) {
  return {
    effectivePlan: "FREE",
    isPremium: false,
    subscription: {
      plan: "FREE",
      status: "INACTIVE",
      asaasCustomerId: null,
      asaasSubscriptionId: null,
      currentPeriodEnd: null,
      ...overrides,
    },
  };
}

describe("POST /api/billing/subscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireVerifiedSessionMock.mockResolvedValue({
      user: {
        id: "user_1",
        name: "Arlen",
        email: "arlen@example.com",
      },
    });
    prismaMock.store.findUnique.mockResolvedValue({
      phoneNumber: "11999999999",
      cellPhone: null,
      whatsappUrl: null,
    });
    prismaMock.user.findUnique.mockResolvedValue({
      asaasCustomerId: null,
    });
    serializeBillingStateMock.mockImplementation((value) => value);
  });

  it("cria customer e assinatura mensal no Asaas para usuario FREE", async () => {
    getUserBillingStateMock
      .mockResolvedValueOnce(makeBillingState())
      .mockResolvedValueOnce(makeBillingState({
        plan: "PREMIUM",
        status: "PENDING",
        asaasCustomerId: "cus_123",
        asaasSubscriptionId: "sub_123",
      }));

    createAsaasCustomerMock.mockResolvedValue({ id: "cus_123" });
    createAsaasSubscriptionMock.mockResolvedValue({
      id: "sub_123",
      nextDueDate: "2026-08-29",
    });
    listAsaasSubscriptionPaymentsMock.mockResolvedValue({
      data: [
        {
          id: "pay_123",
          invoiceUrl: "https://sandbox.asaas.com/i/pay_123",
          status: "PENDING",
          dueDate: "2026-08-29",
        },
      ],
    });

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(createAsaasCustomerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "arlen@example.com",
        externalReference: "user_1",
      })
    );
    expect(syncAsaasCustomerIdMock).toHaveBeenCalledWith("user_1", "cus_123");
    expect(createAsaasSubscriptionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: "cus_123",
        value: 24.9,
      })
    );
    expect(upsertPremiumSubscriptionMock).toHaveBeenCalledWith(
      "user_1",
      expect.objectContaining({
        asaasCustomerId: "cus_123",
        asaasSubscriptionId: "sub_123",
        asaasPaymentId: "pay_123",
      })
    );
    expect(body.checkoutUrl).toBe("https://sandbox.asaas.com/i/pay_123");
  });

  it("reaproveita pagamento pendente sem criar novo customer ou assinatura", async () => {
    getUserBillingStateMock
      .mockResolvedValueOnce(
        makeBillingState({
          plan: "PREMIUM",
          status: "PENDING",
          asaasSubscriptionId: "sub_pending",
          currentPeriodEnd: new Date("2026-09-01T00:00:00Z"),
        })
      )
      .mockResolvedValueOnce(
        makeBillingState({
          plan: "PREMIUM",
          status: "PENDING",
          asaasSubscriptionId: "sub_pending",
        })
      );

    listAsaasSubscriptionPaymentsMock.mockResolvedValue({
      data: [
        {
          id: "pay_existing",
          invoiceUrl: "https://sandbox.asaas.com/i/pay_existing",
          status: "PENDING",
          dueDate: "2026-09-01",
        },
      ],
    });

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.reused).toBe(true);
    expect(body.checkoutUrl).toBe("https://sandbox.asaas.com/i/pay_existing");
    expect(updateSubscriptionSnapshotMock).toHaveBeenCalled();
    expect(createAsaasCustomerMock).not.toHaveBeenCalled();
    expect(createAsaasSubscriptionMock).not.toHaveBeenCalled();
  });

  it("retorna a resposta de sessao quando o usuario nao esta autorizado", async () => {
    requireVerifiedSessionMock.mockResolvedValueOnce(
      NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
    );

    const response = await POST();

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Nao autenticado" });
  });
});
