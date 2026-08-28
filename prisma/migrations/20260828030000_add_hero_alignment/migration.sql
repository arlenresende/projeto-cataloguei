-- CreateEnum
CREATE TYPE "HeroAlignment" AS ENUM ('LEFT', 'CENTER', 'RIGHT');

-- AlterTable
ALTER TABLE "store_heroes" ADD COLUMN "alignment" "HeroAlignment" NOT NULL DEFAULT 'CENTER';
