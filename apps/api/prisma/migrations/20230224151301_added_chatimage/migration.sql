/*
  Warnings:

  - You are about to drop the column `imageKey` on the `ChatMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "imageKey";

-- CreateTable
CREATE TABLE "ChatImage" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "ChatImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatImage" ADD CONSTRAINT "ChatImage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
