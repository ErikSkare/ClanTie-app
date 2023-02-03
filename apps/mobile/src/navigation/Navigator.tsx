import SplashScreen from "@/components/SplashScreen";
import {useAuthenticate} from "@/features/auth";
import useTokenStore from "@/features/auth/stores/useTokenStore";
import {NavigationContainer} from "@react-navigation/native";
import {View, Text, TouchableOpacity} from "react-native";
import AuthStack from "./AuthStack";

const Navigator = () => {
  const {isAuthed, isLoading} = useAuthenticate();

  const logout = useTokenStore((state) => state.logout);

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      {isAuthed ? (
        <View className="flex h-screen justify-center items-center">
          <TouchableOpacity onPress={() => logout()}>
            <Text>Kilépés</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default Navigator;
