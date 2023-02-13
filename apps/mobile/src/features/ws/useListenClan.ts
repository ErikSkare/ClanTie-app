import {useContext, useEffect} from "react";
import {WebSocketContext} from "./WebSocketProvider";

const useListenClan = (clanId: number) => {
  const {socket} = useContext(WebSocketContext);

  useEffect(() => {
    if (socket === null) return;

    socket.emit("clan:start", clanId);

    return () => {
      socket.emit("clan:stop", clanId);
    };
  }, []);
};

export default useListenClan;
