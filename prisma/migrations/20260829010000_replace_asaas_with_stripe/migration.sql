-- Replace Asaas billing state with Stripe billing state.

ALTER TABLE "asaas_webhook_events" DROP CONSTRAINT IF EXISTS "asaas_webhook_events_subscriptionId_fkey";
ALTER TABLE "asaas_webhook_events" DROP CONSTRAINT IF EXISTS "asaas_webhook_events_userId_fkey";

DROP INDEX IF EXISTS "users_asaasCustomerId_key";
DROP INDEX IF EXISTS "subscriptions_asaasSubscriptionId_idx";
DROP INDEX IF EXISTS "asaas_webhook_events_eventType_idx";
DROP INDEX IF EXISTS "asaas_webhook_events_source_idx";
DROP INDEX IF EXISTS "asaas_webhook_events_subscriptionId_idx";
DROP INDEX IF EXISTS "asaas_webhook_events_eventId_key";

ALTER TABLE "users" RENAME COLUMN "asaasCustomerId" TO "stripeCustomerId";

ALTER TABLE "subscriptions" RENAME COLUMN "asaasCustomerId" TO "stripeCustomerId";
ALTER TABLE "subscriptions" RENAME COLUMN "asaasSubscriptionId" TO "stripeSubscriptionId";
ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "asaasPaymentId";
ALTER TABLE "subscriptions" ADD COLUMN "stripePriceId" TEXT;
ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "latestInvoiceUrl";
ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "latestPaymentStatus";
ALTER TABLE "subscriptions" ADD COLUMN "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "asaas_webhook_events" RENAME TO "stripe_webhook_events";
ALTER TABLE "stripe_webhook_events" DROP COLUMN IF EXISTS "source";

ALTER TABLE "stripe_webhook_events" RENAME CONSTRAINT "asaas_webhook_events_pkey" TO "stripe_webhook_events_pkey";

CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "users"("stripeCustomerId");
CREATE INDEX "subscriptions_stripeSubscriptionId_idx" ON "subscriptions"("stripeSubscriptionId");
CREATE UNIQUE INDEX "stripe_webhook_events_eventId_key" ON "stripe_webhook_events"("eventId");
CREATE INDEX "stripe_webhook_events_eventType_idx" ON "stripe_webhook_events"("eventType");
CREATE INDEX "stripe_webhook_events_subscriptionId_idx" ON "stripe_webhook_events"("subscriptionId");

ALTER TABLE "stripe_webhook_events" ADD CONSTRAINT "stripe_webhook_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "stripe_webhook_events" ADD CONSTRAINT "stripe_webhook_events_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
