-- CreateTable
CREATE TABLE "Commission" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Commission_postId_key" ON "Commission"("postId");

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
