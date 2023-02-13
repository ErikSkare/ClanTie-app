-- CreateTable
CREATE TABLE "Picture" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "senderUserId" INTEGER NOT NULL,
    "senderClanId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_senderUserId_senderClanId_fkey" FOREIGN KEY ("senderUserId", "senderClanId") REFERENCES "ClanMember"("userId", "clanId") ON DELETE RESTRICT ON UPDATE CASCADE;
