import {Invitation} from "@prisma/client";
import {Server} from "http";
import socketIo from "socket.io";

export interface SocketData {
  userId: number;
  refreshToken: string;
}

type ChatMessage = {
  content: string | null;
  images: {url: string}[];
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
  fromUser: {id: number; firstName: string; lastName: string};
  clan: {name: string; id: number};
};

export type ServerToClientEvents = {
  // Notifications
  "notification:new": (payload: ReceivedInvitation) => void;

  // Me
  "me:tokens": ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => void;
  "me:expired": () => void;

  // Clan
  "clan:new-member": () => void;
  "clan:user-online": (userId: number) => void;
  "clan:user-offline": (userId: number) => void;
  "clan:user-picture": (userId: number) => void;

  // Chat
  "chat:new-message": (message: ChatMessage) => void;
};

// eslint-disable-next-line
export type ClientToServerEvents = {
  // Clan
  "clan:start": (clanId: number) => void;
  "clan:stop": (clanId: number) => void;

  // Chat
  "chat:start": (clanId: number) => void;
  "chat:stop": (clanId: number) => void;
};

// eslint-disable-next-line
export type InterServerEvents = {};

export default function createIo(httpServer: Server) {
  return new socketIo.Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer);
}

export type IoType = socketIo.Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
