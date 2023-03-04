import { PrismaClient } from "@prisma/client";
import { IoType } from "../../../io";
export default function goOnlineUseCase(prisma: PrismaClient, io: IoType, session: number): Promise<void>;
