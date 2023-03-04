/// <reference types="node" />
import { Invitation } from "@prisma/client";
import { Server } from "http";
import socketIo from "socket.io";
export interface SocketData {
    userId: number;
    refreshToken: string;
}
type ChatMessage = {
    content: string | null;
    images: {
        url: string;
    }[];
    sentBy: {
        user: {
            id: number;
            isActive: boolean;
        };
        nickname: string;
        avatarUrl: string;
    };
    createdAt: Date;
};
export type ReceivedInvitation = Invitation & {
    fromUser: {
        id: number;
        firstName: string;
        lastName: string;
    };
    clan: {
        name: string;
        id: number;
    };
};
export type ServerToClientEvents = {
    "notification:new": (payload: ReceivedInvitation) => void;
    "me:tokens": ({ accessToken, refreshToken, }: {
        accessToken: string;
        refreshToken: string;
    }) => void;
    "me:expired": () => void;
    "clan:new-member": () => void;
    "clan:user-online": (userId: number) => void;
    "clan:user-offline": (userId: number) => void;
    "clan:user-picture": (userId: number) => void;
    "chat:new-message": (message: ChatMessage) => void;
};
export type ClientToServerEvents = {
    "clan:start": (clanId: number) => void;
    "clan:stop": (clanId: number) => void;
    "chat:start": (clanId: number) => void;
    "chat:stop": (clanId: number) => void;
};
export type InterServerEvents = {};
export default function createIo(httpServer: Server): socketIo.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type IoType = socketIo.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export {};
