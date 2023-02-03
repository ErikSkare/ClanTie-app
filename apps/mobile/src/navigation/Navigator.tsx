import SplashScreen from "@/components/SplashScreen";
import {useAuthenticate} from "@/features/auth";
import {NavigationContainer} from "@react-navigation/native";
import {View, Text} from "react-native";
import AuthStack from "./AuthStack";

const Navigator = () => {
  const {isAuthed, isLoading} = useAuthenticate();

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      {isAuthed ? (
        <View className="flex h-screen justify-center items-center">
          <Text>Be vagy lépve!</Text>
        </View>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default Navigator;
