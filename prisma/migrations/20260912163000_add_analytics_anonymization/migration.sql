ALTER TABLE "analytics_events"
ADD COLUMN "anonymizedAt" TIMESTAMP(3);

CREATE INDEX "analytics_events_anonymizedAt_createdAt_idx"
ON "analytics_events"("anonymizedAt", "createdAt");
