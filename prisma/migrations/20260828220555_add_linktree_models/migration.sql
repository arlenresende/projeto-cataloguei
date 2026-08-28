-- CreateTable
CREATE TABLE "linktree" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "backgroundColor" TEXT,
    "textColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "linktree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "linktreeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "linkType" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "linktree_userId_key" ON "linktree"("userId");

-- CreateIndex
CREATE INDEX "linktree_userId_idx" ON "linktree"("userId");

-- CreateIndex
CREATE INDEX "links_linktreeId_idx" ON "links"("linktreeId");

-- AddForeignKey
ALTER TABLE "linktree" ADD CONSTRAINT "linktree_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_linktreeId_fkey" FOREIGN KEY ("linktreeId") REFERENCES "linktree"("id") ON DELETE CASCADE ON UPDATE CASCADE;
