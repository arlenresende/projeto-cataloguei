import "server-only";

import type { AuditAction, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuditActor = {
  id?: string | null;
  email?: string | null;
};

type AuditRequestContext = {
  headers?: Headers | null;
};

type CreateAuditLogInput = {
  action: AuditAction;
  actor?: AuditActor | null;
  targetType: string;
  targetId?: string | null;
  storeId?: string | null;
  metadata?: Prisma.InputJsonValue | null;
  request?: AuditRequestContext | null;
};

function getHeaderValue(headers: Headers | null | undefined, name: string) {
  return headers?.get(name) || null;
}

function getIpAddress(headers: Headers | null | undefined) {
  const forwardedFor = getHeaderValue(headers, "x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return (
    getHeaderValue(headers, "x-real-ip") ||
    getHeaderValue(headers, "cf-connecting-ip") ||
    null
  );
}

export async function createAuditLog(input: CreateAuditLogInput) {
  try {
    return await prisma.auditLog.create({
      data: {
        action: input.action,
        actorUserId: input.actor?.id || null,
        actorEmail: input.actor?.email || null,
        targetType: input.targetType,
        targetId: input.targetId || null,
        storeId: input.storeId || null,
        metadata: input.metadata ?? undefined,
        ipAddress: getIpAddress(input.request?.headers),
        userAgent: getHeaderValue(input.request?.headers, "user-agent"),
      },
    });
  } catch (error) {
    console.error("[audit-log] Falha ao registrar evento", {
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      error,
    });

    return null;
  }
}
