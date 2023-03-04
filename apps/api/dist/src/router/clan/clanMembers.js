"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3_1 = require("../../s3");
function ClanMembers(prisma) {
    return Object.assign(prisma.clanMember, {
        populateAvatarUrl(data) {
            const url = (0, s3_1.retrieveImage)(data.avatarKey);
            return Object.assign(Object.assign({}, data), { avatarUrl: url });
        },
        populateAvatarUrls(data) {
            const clanMembersService = ClanMembers(prisma);
            return data.map((current) => clanMembersService.populateAvatarUrl(current));
        },
    });
}
exports.default = ClanMembers;
