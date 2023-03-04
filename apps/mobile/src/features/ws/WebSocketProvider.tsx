import {useEffect, createContext, useState} from "react";
import {Text, View, ViewProps} from "react-native";
import Constants from "expo-constants";
import {io, Socket} from "socket.io-client";
import {ClientToServerEvents, ServerToClientEvents} from "@clantie/api";
import {trpc} from "@/lib/trpc";
import SplashScreen from "@/components/SplashScreen";
import {useAuthenticate, useTokenStore} from "@/features/auth";

export type S = Socket<ServerToClientEvents, ClientToServerEvents> | null;

export const WebSocketContext = createContext<{
  socket: S;
  isConnected: boolean;
}>({
  socket: null,
  isConnected: false,
});

const WebSocketProvider: React.FC<ViewProps> = ({children}) => {
  const utils = trpc.useContext();

  const authenticate = useTokenStore((state) => state.authenticate);
  const logout = useTokenStore((state) => state.logout);

  const {isAuthed} = useAuthenticate();
  const [socket, setSocket] = useState<S>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthed) return;

    const {accessToken, refreshToken} = useTokenStore.getState();

    const newSocket: S = io(`wss://${Constants.manifest?.extra?.apiUrl}`, {
      auth: {accessToken, refreshToken},
    });

    // New tokens
    newSocket.on("me:tokens", ({accessToken, refreshToken}) => {
      authenticate(accessToken, refreshToken);
    });

    // Invalid tokens
    newSocket.on("me:expired", () => logout());
    newSocket.on("connect_error", (error) => {
      if (error.message === "Authentication failed!") logout();
    });

    // Reconnecting
    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });
    newSocket.on("connect", () => {
      utils.invalidate();
      setIsConnected(true);
    });

    setIsConnected(true);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [isAuthed]);

  if (!socket) return <SplashScreen />;

  return (
    <WebSocketContext.Provider value={{socket, isConnected}}>
      {!isConnected && (
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
