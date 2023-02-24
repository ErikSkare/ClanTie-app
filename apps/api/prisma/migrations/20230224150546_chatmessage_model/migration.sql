-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" SERIAL NOT NULL,
    "senderUserId" INTEGER NOT NULL,
    "senderClanId" INTEGER NOT NULL,
    "content" TEXT,
    "imageKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderUserId_senderClanId_fkey" FOREIGN KEY ("senderUserId", "senderClanId") REFERENCES "ClanMember"("userId", "clanId") ON DELETE RESTRICT ON UPDATE CASCADE;
