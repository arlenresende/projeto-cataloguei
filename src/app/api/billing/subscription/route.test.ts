import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

const {
  requireVerifiedSessionMock,
  cancelAsaasSubscriptionMock,
  getUserBillingStateMock,
  serializeBillingStateMock,
  updateSubscriptionSnapshotMock,
  prismaMock,
} = vi.hoisted(() => ({
  requireVerifiedSessionMock: vi.fn(),
  cancelAsaasSubscriptionMock: vi.fn(),
  getUserBillingStateMock: vi.fn(),
  serializeBillingStateMock: vi.fn((value) => value),
  updateSubscriptionSnapshotMock: vi.fn(),
  prismaMock: {
    store: {
      findUnique: vi.fn(),
    },
    product: {
      count: vi.fn(),
    },
    storeHero: {
      count: vi.fn(),
    },
  },
}));

vi.mock("@/lib/api-session", () => ({
  requireVerifiedSession: requireVerifiedSessionMock,
}));

vi.mock("@/lib/asaas/subscriptions", () => ({
  cancelAsaasSubscription: cancelAsaasSubscriptionMock,
}));

vi.mock("@/lib/billing/subscription", () => ({
  getUserBillingState: getUserBillingStateMock,
  serializeBillingState: serializeBillingStateMock,
  updateSubscriptionSnapshot: updateSubscriptionSnapshotMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { DELETE } from "@/app/api/billing/subscription/route";

function makeBillingState(options?: {
  effectivePlan?: "FREE" | "PREMIUM";
  isPremium?: boolean;
  subscription?: Record<string, unknown>;
}) {
  return {
    effectivePlan: options?.effectivePlan ?? "PREMIUM",
    isPremium: options?.isPremium ?? true,
    subscription: {
      plan: "PREMIUM",
      status: "ACTIVE",
      asaasSubscriptionId: "sub_123",
      currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ...options?.subscription,
    },
  };
}

describe("DELETE /api/billing/subscription", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireVerifiedSessionMock.mockResolvedValue({
      user: { id: "user_1" },
    });
    serializeBillingStateMock.mockImplementation((value) => value);
  });

  it("cancela a assinatura no Asaas e preserva acesso ate o fim do periodo pago", async () => {
    getUserBillingStateMock
      .mockResolvedValueOnce(makeBillingState())
      .mockResolvedValueOnce(
        makeBillingState({
          subscription: {
            plan: "PREMIUM",
            status: "ACTIVE",
            asaasSubscriptionId: "sub_123",
          },
        })
      );

    const response = await DELETE();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(cancelAsaasSubscriptionMock).toHaveBeenCalledWith("sub_123");
    expect(updateSubscriptionSnapshotMock).toHaveBeenCalledWith(
      { userId: "user_1" },
      expect.objectContaining({
        latestPaymentStatus: "CANCELED",
        status: "ACTIVE",
      })
    );
    expect(body.success).toBe(true);
  });

  it("retorna 404 quando nao existe assinatura premium para cancelar", async () => {
    getUserBillingStateMock.mockResolvedValueOnce(
      makeBillingState({
        effectivePlan: "FREE",
        isPremium: false,
        subscription: {
          plan: "FREE",
          status: "INACTIVE",
          asaasSubscriptionId: null,
          currentPeriodEnd: null,
        },
      })
    );

    const response = await DELETE();

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "Nenhuma assinatura Premium foi encontrada para cancelamento.",
    });
  });

  it("retorna a resposta de sessao quando o usuario nao esta autorizado", async () => {
    requireVerifiedSessionMock.mockResolvedValueOnce(
      NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
    );

    const response = await DELETE();

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Nao autenticado" });
  });
});
