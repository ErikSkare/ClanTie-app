-- CreateTable
CREATE TABLE "ClanMemberSeenPicture" (
    "memberUserId" INTEGER NOT NULL,
    "memberClanId" INTEGER NOT NULL,
    "pictureId" INTEGER NOT NULL,

    CONSTRAINT "ClanMemberSeenPicture_pkey" PRIMARY KEY ("memberUserId","memberClanId","pictureId")
);

-- AddForeignKey
ALTER TABLE "ClanMemberSeenPicture" ADD CONSTRAINT "ClanMemberSeenPicture_memberUserId_memberClanId_fkey" FOREIGN KEY ("memberUserId", "memberClanId") REFERENCES "ClanMember"("userId", "clanId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClanMemberSeenPicture" ADD CONSTRAINT "ClanMemberSeenPicture_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "Picture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
