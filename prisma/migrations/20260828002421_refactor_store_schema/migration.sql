/*
  Warnings:

  - You are about to drop the column `bannerUrl` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `primaryColor` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryColor` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `stores` table. All the data in the column will be lost.
  - Added the required column `userId` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_ownerId_fkey";

-- DropIndex
DROP INDEX "stores_ownerId_key";

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "bannerUrl",
DROP COLUMN "logoUrl",
DROP COLUMN "ownerId",
DROP COLUMN "primaryColor",
DROP COLUMN "secondaryColor",
DROP COLUMN "theme",
DROP COLUMN "whatsapp",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "cellPhone" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "facebookUrl" TEXT,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "themeStore" "StoreThemeSegment" NOT NULL DEFAULT 'DEFAULT',
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "websiteUrl" TEXT,
ADD COLUMN     "whatsappUrl" TEXT;

-- CreateIndex
CREATE INDEX "stores_userId_idx" ON "stores"("userId");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
