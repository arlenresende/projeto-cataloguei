import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireVerifiedSessionMock, isAdminUserMock, prismaMock } = vi.hoisted(
  () => ({
    requireVerifiedSessionMock: vi.fn(),
    isAdminUserMock: vi.fn(),
    prismaMock: {
      store: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    },
  })
);

vi.mock("@/lib/api-session", () => ({
  requireVerifiedSession: requireVerifiedSessionMock,
}));

vi.mock("@/lib/feature-requests", () => ({
  isAdminUser: isAdminUserMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { PATCH } from "@/app/api/admin/stores/[id]/suspension/route";

function makeRequest(body: unknown) {
  return new Request("http://localhost:3000/api/admin/stores/store_1/suspension", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

const params = { params: Promise.resolve({ id: "store_1" }) };

describe("PATCH /api/admin/stores/[id]/suspension", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireVerifiedSessionMock.mockResolvedValue({
      user: { id: "admin_1", email: "admin@cataloguei.com" },
    });
    isAdminUserMock.mockResolvedValue(true);
    prismaMock.store.findUnique.mockResolvedValue({ id: "store_1" });
    prismaMock.store.update.mockResolvedValue({
      id: "store_1",
      name: "Loja Modelo",
      slug: "loja-modelo",
      isActive: false,
      adminSuspendedAt: new Date("2026-09-12T12:00:00Z"),
      adminSuspensionReason: "Violou os termos",
      adminSuspendedById: "admin_1",
    });
  });

  it("bloqueia usuario que nao e admin", async () => {
    isAdminUserMock.mockResolvedValueOnce(false);

    const response = await PATCH(
      makeRequest({ action: "suspend", reason: "Violou os termos" }),
      params
    );

    expect(response.status).toBe(403);
    expect(prismaMock.store.update).not.toHaveBeenCalled();
  });

  it("suspende a loja com motivo e admin responsavel", async () => {
    const response = await PATCH(
      makeRequest({ action: "suspend", reason: "Violou os termos" }),
      params
    );

    expect(response.status).toBe(200);
    expect(prismaMock.store.update).toHaveBeenCalledWith({
      where: { id: "store_1" },
      data: {
        isActive: false,
        adminSuspendedAt: expect.any(Date),
        adminSuspensionReason: "Violou os termos",
        adminSuspendedById: "admin_1",
      },
      select: expect.any(Object),
    });
  });

  it("reativa a loja e limpa os campos de suspensao", async () => {
    await PATCH(makeRequest({ action: "restore" }), params);

    expect(prismaMock.store.update).toHaveBeenCalledWith({
      where: { id: "store_1" },
      data: {
        isActive: true,
        adminSuspendedAt: null,
        adminSuspensionReason: null,
        adminSuspendedById: null,
      },
      select: expect.any(Object),
    });
  });

  it("retorna 404 quando a loja nao existe", async () => {
    prismaMock.store.findUnique.mockResolvedValueOnce(null);

    const response = await PATCH(
      makeRequest({ action: "suspend", reason: "Violou os termos" }),
      params
    );

    expect(response.status).toBe(404);
    expect(prismaMock.store.update).not.toHaveBeenCalled();
  });
});
