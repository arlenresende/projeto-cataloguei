import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    analyticsEvent: {
      deleteMany: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import {
  enforceAnalyticsRetention,
  getAnalyticsRetentionPolicy,
} from "@/lib/analytics/retention";

describe("analytics retention", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.ANALYTICS_RAW_RETENTION_DAYS;
    delete process.env.ANALYTICS_EVENT_RETENTION_DAYS;
  });

  it("calcula os cortes padrao de anonimização e exclusão", () => {
    const policy = getAnalyticsRetentionPolicy(
      new Date("2026-09-12T12:00:00Z")
    );

    expect(policy.rawRetentionDays).toBe(30);
    expect(policy.eventRetentionDays).toBe(180);
    expect(policy.anonymizeBefore.toISOString()).toBe(
      "2026-08-13T12:00:00.000Z"
    );
    expect(policy.deleteBefore.toISOString()).toBe(
      "2026-03-16T12:00:00.000Z"
    );
  });

  it("anonimiza eventos antigos e remove eventos vencidos", async () => {
    const now = new Date("2026-09-12T12:00:00Z");
    prismaMock.analyticsEvent.deleteMany.mockResolvedValue({ count: 4 });
    prismaMock.analyticsEvent.updateMany.mockResolvedValue({ count: 9 });

    const result = await enforceAnalyticsRetention(now);

    expect(prismaMock.analyticsEvent.deleteMany).toHaveBeenCalledWith({
      where: {
        createdAt: {
          lt: new Date("2026-03-16T12:00:00.000Z"),
        },
      },
    });
    expect(prismaMock.analyticsEvent.updateMany).toHaveBeenCalledWith({
      where: {
        anonymizedAt: null,
        createdAt: {
          lt: new Date("2026-08-13T12:00:00.000Z"),
          gte: new Date("2026-03-16T12:00:00.000Z"),
        },
      },
      data: {
        path: null,
        referrer: null,
        userAgent: null,
        ipHash: null,
        metadata: {},
        anonymizedAt: now,
      },
    });
    expect(result).toMatchObject({
      anonymized: 9,
      deleted: 4,
    });
  });
});
