import {useContext, useEffect} from "react";
import {S, WebSocketContext} from "./WebSocketProvider";

const useListen = (
  onJoin: (socket: NonNullable<S>) => void,
  onLeave: (socket: NonNullable<S>) => void
) => {
  const {socket} = useContext(WebSocketContext);

  useEffect(() => {
    if (socket === null) return;

    onJoin(socket);

    return () => {
      onLeave(socket);
    };
  }, []);
};

export default useListen;
