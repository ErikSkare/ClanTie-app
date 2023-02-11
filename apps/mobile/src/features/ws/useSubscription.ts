import {ServerToClientEvents} from "@clantie/api";
import {useContext, useEffect} from "react";
import {WebSocketContext} from "./WebSocketProvider";

type Keys = keyof ServerToClientEvents;

const useSubscription = <Key extends Keys>(
  event: Key,
  onData: ServerToClientEvents[Key]
) => {
  const {socket} = useContext(WebSocketContext);

  useEffect(() => {
    if (socket === null) return;

    // eslint-disable-next-line
    // @ts-expect-error
    const listener = (...params) => onData(...params);

    // eslint-disable-next-line
    // @ts-expect-error
    socket.on(event, listener);

    return () => {
      // eslint-disable-next-line
      // @ts-expect-error
      socket.off(event, listener);
    };
  }, [socket]);
};

export default useSubscription;
