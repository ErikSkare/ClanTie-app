import { PrismaClient } from "@prisma/client";
export default function getReceivedInvitationsUseCase(prisma: PrismaClient, session: number): Promise<(import(".prisma/client").Invitation & {
    clan: {
        id: number;
        name: string;
    };
    fromUser: {
        id: number;
        firstName: string;
        lastName: string;
    };
})[]>;
