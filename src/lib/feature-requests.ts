import "server-only";

import { prisma } from "@/lib/prisma";

export type FeatureRequestStatus = "OPEN" | "IN_PROGRESS" | "DONE";

export type FeatureRequestListItem = {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  adminNote: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  userName: string;
  userEmail: string;
};

export function isAdminEmailFallback(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}

export async function isAdminUser(input: {
  userId: string;
  email?: string | null;
}) {
  try {
    const [user] = await prisma.$queryRaw<Array<{ role: string }>>`
      SELECT "role"::text AS role
      FROM "users"
      WHERE "id" = ${input.userId}
      LIMIT 1
    `;

    return user?.role === "ADMIN" || isAdminEmailFallback(input.email);
  } catch {
    return isAdminEmailFallback(input.email);
  }
}

export async function listFeatureRequests(input: {
  userId: string;
  isAdmin: boolean;
}) {
  if (input.isAdmin) {
    return prisma.$queryRaw<FeatureRequestListItem[]>`
      SELECT
        fr."id",
        fr."title",
        fr."description",
        fr."status"::text AS "status",
        fr."adminNote",
        fr."createdAt",
        fr."updatedAt",
        fr."userId",
        u."name" AS "userName",
        u."email" AS "userEmail"
      FROM "feature_requests" fr
      INNER JOIN "users" u ON u."id" = fr."userId"
      ORDER BY fr."createdAt" DESC
    `;
  }

  return prisma.$queryRaw<FeatureRequestListItem[]>`
    SELECT
      fr."id",
      fr."title",
      fr."description",
      fr."status"::text AS "status",
      fr."adminNote",
      fr."createdAt",
      fr."updatedAt",
      fr."userId",
      u."name" AS "userName",
      u."email" AS "userEmail"
    FROM "feature_requests" fr
    INNER JOIN "users" u ON u."id" = fr."userId"
    WHERE fr."userId" = ${input.userId}
    ORDER BY fr."createdAt" DESC
  `;
}

export async function createFeatureRequest(input: {
  id: string;
  userId: string;
  title: string;
  description: string;
}) {
  const [request] = await prisma.$queryRaw<FeatureRequestListItem[]>`
    INSERT INTO "feature_requests" (
      "id",
      "userId",
      "title",
      "description",
      "status",
      "createdAt",
      "updatedAt"
    )
    VALUES (
      ${input.id},
      ${input.userId},
      ${input.title},
      ${input.description},
      'OPEN'::"FeatureRequestStatus",
      NOW(),
      NOW()
    )
    RETURNING
      "id",
      "title",
      "description",
      "status"::text AS "status",
      "adminNote",
      "createdAt",
      "updatedAt",
      "userId",
      '' AS "userName",
      '' AS "userEmail"
  `;

  return request;
}

export async function updateFeatureRequestStatus(input: {
  id: string;
  status: FeatureRequestStatus;
  adminNote?: string | null;
}) {
  const [request] = await prisma.$queryRaw<FeatureRequestListItem[]>`
    UPDATE "feature_requests" fr
    SET
      "status" = ${input.status}::"FeatureRequestStatus",
      "adminNote" = ${input.adminNote ?? null},
      "updatedAt" = NOW()
    FROM "users" u
    WHERE fr."id" = ${input.id}
      AND u."id" = fr."userId"
    RETURNING
      fr."id",
      fr."title",
      fr."description",
      fr."status"::text AS "status",
      fr."adminNote",
      fr."createdAt",
      fr."updatedAt",
      fr."userId",
      u."name" AS "userName",
      u."email" AS "userEmail"
  `;

  return request ?? null;
}
