-- CreateTable
CREATE TABLE "store_heroes" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "bgColor" TEXT,
    "buttonText" TEXT,
    "buttonUrl" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_heroes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "store_heroes_storeId_idx" ON "store_heroes"("storeId");

-- CreateIndex
CREATE INDEX "store_heroes_storeId_isActive_position_idx" ON "store_heroes"("storeId", "isActive", "position");

-- AddForeignKey
ALTER TABLE "store_heroes" ADD CONSTRAINT "store_heroes_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
