import {useEffect, createContext, useState} from "react";
import {Text, View, ViewProps} from "react-native";
import Constants from "expo-constants";
import {io, Socket} from "socket.io-client";
import SplashScreen from "@/components/SplashScreen";
import {useAuthenticate, useRefreshToken, useTokenStore} from "@/features/auth";
import {ClientToServerEvents, ServerToClientEvents} from "@clantie/api";

type S = Socket<ServerToClientEvents, ClientToServerEvents> | null;

export const WebSocketContext = createContext<{
  socket: S;
}>({
  socket: null,
});

const WebSocketProvider: React.FC<ViewProps> = ({children}) => {
  const {isAuthed} = useAuthenticate();

  const authenticate = useTokenStore((state) => state.authenticate);
  const tryRefresh = useRefreshToken();

  const [socket, setSocket] = useState<S>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    if (!isAuthed) return;
    tryRefresh();

    const {accessToken, refreshToken} = useTokenStore.getState();

    const s: S = io(`ws://${Constants.manifest?.extra?.apiUrl}`, {
      auth: {accessToken, refreshToken},
    });

    s.on("newTokens", ({accessToken, refreshToken}) => {
      authenticate(accessToken, refreshToken);
    })
      .on("disconnect", () => setIsReconnecting(true))
      .on("connect", () => setIsReconnecting(false));

    setSocket(s);

    return () => {
      s.disconnect();
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
