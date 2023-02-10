import {Invitation} from "@prisma/client";

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
};

// eslint-disable-next-line
export type ClientToServerEvents = {};

export type InterServerEvents = {
  ping: () => void;
};
