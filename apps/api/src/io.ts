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
  newInvitation: (payload: ReceivedInvitation) => void;
  newTokens: ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => void;
  tokensExpired: () => void;
};

// eslint-disable-next-line
export type ClientToServerEvents = {};

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
