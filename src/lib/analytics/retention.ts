import "server-only";

import { prisma } from "@/lib/prisma";

export const DEFAULT_ANALYTICS_RAW_RETENTION_DAYS = 30;
export const DEFAULT_ANALYTICS_EVENT_RETENTION_DAYS = 180;

function parsePositiveInteger(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function subtractDays(date: Date, days: number) {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
}

export function getAnalyticsRetentionPolicy(now = new Date()) {
  const rawRetentionDays = parsePositiveInteger(
    process.env.ANALYTICS_RAW_RETENTION_DAYS,
    DEFAULT_ANALYTICS_RAW_RETENTION_DAYS
  );
  const eventRetentionDays = parsePositiveInteger(
    process.env.ANALYTICS_EVENT_RETENTION_DAYS,
    DEFAULT_ANALYTICS_EVENT_RETENTION_DAYS
  );

  return {
    rawRetentionDays,
    eventRetentionDays,
    anonymizeBefore: subtractDays(now, rawRetentionDays),
    deleteBefore: subtractDays(now, eventRetentionDays),
  };
}

export async function enforceAnalyticsRetention(now = new Date()) {
  const policy = getAnalyticsRetentionPolicy(now);

  const deleted = await prisma.analyticsEvent.deleteMany({
    where: {
      createdAt: {
        lt: policy.deleteBefore,
      },
    },
  });

  const anonymized = await prisma.analyticsEvent.updateMany({
    where: {
      anonymizedAt: null,
      createdAt: {
        lt: policy.anonymizeBefore,
        gte: policy.deleteBefore,
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

  return {
    anonymized: anonymized.count,
    deleted: deleted.count,
    policy: {
      rawRetentionDays: policy.rawRetentionDays,
      eventRetentionDays: policy.eventRetentionDays,
      anonymizeBefore: policy.anonymizeBefore.toISOString(),
      deleteBefore: policy.deleteBefore.toISOString(),
    },
  };
}
