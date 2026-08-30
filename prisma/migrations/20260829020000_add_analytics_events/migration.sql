CREATE TYPE "AnalyticsEventType" AS ENUM (
  'STORE_VIEW',
  'PRODUCT_VIEW',
  'CATEGORY_VIEW',
  'LINKTREE_VIEW',
  'WHATSAPP_CLICK',
  'PRODUCT_WHATSAPP_CLICK',
  'SHARE_CLICK',
  'LINKTREE_LINK_CLICK'
);

CREATE TABLE "analytics_events" (
  "id" TEXT NOT NULL,
  "storeId" TEXT NOT NULL,
  "productId" TEXT,
  "categoryId" TEXT,
  "linkId" TEXT,
  "type" "AnalyticsEventType" NOT NULL,
  "path" TEXT,
  "referrer" TEXT,
  "userAgent" TEXT,
  "ipHash" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "analytics_events_storeId_type_createdAt_idx" ON "analytics_events"("storeId", "type", "createdAt");
CREATE INDEX "analytics_events_productId_type_createdAt_idx" ON "analytics_events"("productId", "type", "createdAt");
CREATE INDEX "analytics_events_categoryId_type_createdAt_idx" ON "analytics_events"("categoryId", "type", "createdAt");
CREATE INDEX "analytics_events_linkId_type_createdAt_idx" ON "analytics_events"("linkId", "type", "createdAt");
CREATE INDEX "analytics_events_createdAt_idx" ON "analytics_events"("createdAt");

ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE SET NULL ON UPDATE CASCADE;
