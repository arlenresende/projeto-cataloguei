CREATE TYPE "UserRole" AS ENUM ('MERCHANT', 'ADMIN');

ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'MERCHANT';

CREATE INDEX "users_role_idx" ON "users"("role");
