import { PrismaClient } from "@prisma/client";
export default function GetAllClansUseCase(prisma: PrismaClient, session: number): Promise<{
    members: (import(".prisma/client").ClanMember & {
        avatarUrl: string;
    })[];
    id: number;
    name: string;
    createdAt: Date;
}[]>;
