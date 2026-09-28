-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM (
  'USER_CREATED',
  'STORE_CREATED',
  'STORE_UPDATED',
  'STORE_DELETED',
  'STORE_SUSPENDED',
  'STORE_RESTORED',
  'SUBSCRIPTION_STARTED',
  'SUBSCRIPTION_CANCELED',
  'STRIPE_WEBHOOK_PROCESSED',
  'FEATURE_REQUEST_CREATED',
  'FEATURE_REQUEST_UPDATED'
);

-- CreateTable
CREATE TABLE "audit_logs" (
  "id" TEXT NOT NULL,
  "action" "AuditAction" NOT NULL,
  "actorUserId" TEXT,
  "actorEmail" TEXT,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT,
  "storeId" TEXT,
  "metadata" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_actorUserId_idx" ON "audit_logs"("actorUserId");

-- CreateIndex
CREATE INDEX "audit_logs_targetType_targetId_idx" ON "audit_logs"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "audit_logs_storeId_idx" ON "audit_logs"("storeId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");
