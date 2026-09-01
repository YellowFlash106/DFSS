/*
  Warnings:

  - A unique constraint covering the columns `[publicToken]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "publicToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "File_publicToken_key" ON "File"("publicToken");
