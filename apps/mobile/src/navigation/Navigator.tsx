import SplashScreen from "@/components/SplashScreen";
import {useAuthenticate} from "@/features/auth";
import {NavigationContainer} from "@react-navigation/native";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";

const Navigator = () => {
  const {isAuthed, isLoading} = useAuthenticate();

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      {isAuthed ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Navigator;
