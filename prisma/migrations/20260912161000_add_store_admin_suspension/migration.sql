ALTER TABLE "stores"
ADD COLUMN "adminSuspendedAt" TIMESTAMP(3),
ADD COLUMN "adminSuspensionReason" TEXT,
ADD COLUMN "adminSuspendedById" TEXT;

CREATE INDEX "stores_adminSuspendedAt_idx" ON "stores"("adminSuspendedAt");
