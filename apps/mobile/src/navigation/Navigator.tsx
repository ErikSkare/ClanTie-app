import {useEffect} from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";
import SplashScreen from "@/components/SplashScreen";
import {useAuthenticate, useRefreshToken} from "@/features/auth";
import {NavigationContainer} from "@react-navigation/native";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";

const Navigator = () => {
  const {isAuthed, isLoading} = useAuthenticate();

  const tryRefresh = useRefreshToken();

  useEffect(() => {
    tryRefresh();
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuthed ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Navigator;
