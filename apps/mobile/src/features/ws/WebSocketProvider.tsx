import {useEffect, createContext, useState} from "react";
import {Text, View, ViewProps} from "react-native";
import Constants from "expo-constants";
import {io, Socket} from "socket.io-client";
import {ClientToServerEvents, ServerToClientEvents} from "@clantie/api";
import {trpc} from "@/lib/trpc";
import SplashScreen from "@/components/SplashScreen";
import {useAuthenticate, useTokenStore} from "@/features/auth";

type S = Socket<ServerToClientEvents, ClientToServerEvents> | null;

export const WebSocketContext = createContext<{
  socket: S;
}>({
  socket: null,
});

const WebSocketProvider: React.FC<ViewProps> = ({children}) => {
  const utils = trpc.useContext();

  const authenticate = useTokenStore((state) => state.authenticate);
  const logout = useTokenStore((state) => state.logout);

  const {isAuthed} = useAuthenticate();
  const [socket, setSocket] = useState<S>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    if (!isAuthed) return;

    const {accessToken, refreshToken} = useTokenStore.getState();

    const newSocket: S = io(`ws://${Constants.manifest?.extra?.apiUrl}`, {
      auth: {accessToken, refreshToken},
    });

    newSocket.on("newTokens", ({accessToken, refreshToken}) => {
      authenticate(accessToken, refreshToken);
    });
    newSocket.on("tokensExpired", () => logout());
    newSocket.on("connect_error", (error) => {
      if (error.message === "Authentication failed!") logout();
    });
    newSocket.on("disconnect", () => {
      setIsReconnecting(true);
    });
    newSocket.on("connect", () => {
      utils.invalidate();
      setIsReconnecting(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [isAuthed]);

  if (!socket) return <SplashScreen />;

  return (
    <WebSocketContext.Provider value={{socket}}>
      {isReconnecting && (
        <View className="justify-center items-center bg-blue-600 py-2">
          <Text className="text-white" style={{fontFamily: "Roboto_500Medium"}}>
            Újrakapcsolódás...
          </Text>
        </View>
      )}
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
