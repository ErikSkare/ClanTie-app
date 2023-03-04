"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3_1 = require("../../s3");
function Pictures(prisma) {
    return Object.assign(prisma.clanMember, {
        populateImageUrl(data) {
            const url = (0, s3_1.retrieveImage)(data.key);
            return Object.assign(Object.assign({}, data), { imageUrl: url });
        },
    });
}
exports.default = Pictures;
