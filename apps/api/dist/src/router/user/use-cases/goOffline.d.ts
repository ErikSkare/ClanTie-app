import { PrismaClient } from "@prisma/client";
import { IoType } from "../../../io";
export default function goOfflineUseCase(prisma: PrismaClient, io: IoType, session: number): Promise<void>;
