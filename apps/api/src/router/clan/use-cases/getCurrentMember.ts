import {PrismaClient} from "@prisma/client";
import {TRPCError} from "@trpc/server";
import {z} from "zod";
import ClanMembers from "../clanMembers";

export const GetCurrentMemberSchema = z.object({
  clanId: z.number(),
});

export default async function getCurrentMemberUseCase(
  prisma: PrismaClient,
  session: number,
  input: z.infer<typeof GetCurrentMemberSchema>
) {
  const member = await prisma.clanMember.findUnique({
    where: {userId_clanId: {userId: session, clanId: input.clanId}},
    include: {user: true},
  });

  if (!member) throw new TRPCError({code: "BAD_REQUEST"});

  const clanMembersService = ClanMembers(prisma);
  return clanMembersService.populateAvatarUrl(member);
}
