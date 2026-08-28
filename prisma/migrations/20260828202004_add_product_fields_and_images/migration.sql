/*
  Warnings:

  - The `description` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[storeId,slug]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,sku]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "compareAtPrice" DECIMAL(10,2),
ADD COLUMN     "descriptionHtml" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "minStock" INTEGER,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weight" DECIMAL(10,3),
DROP COLUMN "description",
ADD COLUMN     "description" JSONB;

-- CreateTable
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_images_productId_idx" ON "product_images"("productId");

-- CreateIndex
CREATE INDEX "product_images_productId_position_idx" ON "product_images"("productId", "position");

-- CreateIndex
CREATE INDEX "products_storeId_idx" ON "products"("storeId");

-- CreateIndex
CREATE INDEX "products_storeId_active_idx" ON "products"("storeId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "products_storeId_slug_key" ON "products"("storeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_storeId_sku_key" ON "products"("storeId", "sku");

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
