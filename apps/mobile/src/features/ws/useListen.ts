import {useContext, useEffect} from "react";
import {S, WebSocketContext} from "./WebSocketProvider";

const useListen = (
  onJoin: (socket: NonNullable<S>) => void,
  onLeave: (socket: NonNullable<S>) => void
) => {
  const {socket, isConnected} = useContext(WebSocketContext);

  useEffect(() => {
    if (socket === null || !isConnected) return;

    onJoin(socket);

    return () => {
      onLeave(socket);
    };
  }, [socket, isConnected]);
};

export default useListen;
