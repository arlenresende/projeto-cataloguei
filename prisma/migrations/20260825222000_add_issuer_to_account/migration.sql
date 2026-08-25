-- DropIndex
DROP INDEX IF EXISTS "accounts_providerId_accountId_key";

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "issuer" TEXT NOT NULL DEFAULT 'local:credential';

-- CreateIndex
CREATE UNIQUE INDEX "accounts_issuer_accountId_key" ON "accounts"("issuer", "accountId");
