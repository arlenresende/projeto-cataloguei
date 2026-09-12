CREATE TYPE "LandingLeadStatus" AS ENUM (
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CONVERTED',
  'DISCARDED'
);

CREATE TABLE "landing_leads" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "whatsapp" TEXT NOT NULL,
  "businessType" TEXT,
  "currentSalesChannel" TEXT,
  "monthlyOrders" TEXT,
  "message" TEXT,
  "source" TEXT,
  "utmSource" TEXT,
  "utmMedium" TEXT,
  "utmCampaign" TEXT,
  "utmTerm" TEXT,
  "utmContent" TEXT,
  "status" "LandingLeadStatus" NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "landing_leads_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "landing_leads_whatsapp_source_key"
ON "landing_leads"("whatsapp", "source");

CREATE INDEX "landing_leads_status_createdAt_idx"
ON "landing_leads"("status", "createdAt");

CREATE INDEX "landing_leads_source_createdAt_idx"
ON "landing_leads"("source", "createdAt");
