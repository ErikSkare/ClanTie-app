import {Invitation} from "@prisma/client";
import {Server} from "http";
import socketIo from "socket.io";

export interface SocketData {
  userId: number;
  refreshToken: string;
}

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

  // User
  "user:online": (userId: number) => void;
  "user:offline": (userId: number) => void;
  "user:new-picture": (userId: number, pictureId: number) => void;
};

// eslint-disable-next-line
export type ClientToServerEvents = {
  // Clan
  "clan:start": (clanId: number) => void;
  "clan:stop": (clanId: number) => void;
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
