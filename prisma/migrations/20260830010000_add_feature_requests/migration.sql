CREATE TYPE "FeatureRequestStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE');

CREATE TABLE "feature_requests" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "FeatureRequestStatus" NOT NULL DEFAULT 'OPEN',
  "adminNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "feature_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "feature_requests_userId_status_idx" ON "feature_requests"("userId", "status");
CREATE INDEX "feature_requests_status_createdAt_idx" ON "feature_requests"("status", "createdAt");

ALTER TABLE "feature_requests" ADD CONSTRAINT "feature_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
