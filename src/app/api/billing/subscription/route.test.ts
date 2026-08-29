import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

const {
  requireVerifiedSessionMock,
  getUserBillingStateMock,
  serializeBillingStateMock,
  stripeMock,
  prismaMock,
} = vi.hoisted(() => ({
  requireVerifiedSessionMock: vi.fn(),
  getUserBillingStateMock: vi.fn(),
  serializeBillingStateMock: vi.fn((value) => value),
  stripeMock: {
    billingPortal: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
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

vi.mock("@/lib/billing/subscription", () => ({
  getUserBillingState: getUserBillingStateMock,
  serializeBillingState: serializeBillingStateMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("@/lib/site-config", () => ({
  absoluteUrl: vi.fn((path: string) => `http://localhost:3000${path}`),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(() => stripeMock),
}));

import { POST } from "@/app/api/billing/subscription/route";

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
      stripeCustomerId: "cus_123",
      currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ...options?.subscription,
    },
  };
}

describe("POST /api/billing/subscription", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireVerifiedSessionMock.mockResolvedValue({
      user: { id: "user_1" },
    });
    stripeMock.billingPortal.sessions.create.mockResolvedValue({
      url: "https://billing.stripe.com/p/session_123",
    });
  });

  it("cria uma sessao do Customer Portal para o customer do usuario", async () => {
    getUserBillingStateMock.mockResolvedValueOnce(makeBillingState());

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(stripeMock.billingPortal.sessions.create).toHaveBeenCalledWith({
      customer: "cus_123",
      return_url: "http://localhost:3000/admin/plans",
    });
    expect(body.portalUrl).toBe("https://billing.stripe.com/p/session_123");
  });

  it("retorna 404 quando nao existe assinatura premium para gerenciar", async () => {
    getUserBillingStateMock.mockResolvedValueOnce(
      makeBillingState({
        effectivePlan: "FREE",
        isPremium: false,
        subscription: {
          plan: "FREE",
          status: "INACTIVE",
          stripeCustomerId: null,
          currentPeriodEnd: null,
        },
      })
    );

    const response = await POST();

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "Nenhuma assinatura Premium foi encontrada para gerenciamento.",
    });
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
