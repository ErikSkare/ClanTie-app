import { PrismaClient } from "@prisma/client";
export default function MeWithMembershipsUseCase(prisma: PrismaClient, session: number): Promise<{
    memberships: (import(".prisma/client").ClanMember & {
        avatarUrl: string;
    })[];
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
}>;
