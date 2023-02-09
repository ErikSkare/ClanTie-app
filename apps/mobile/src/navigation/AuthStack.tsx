import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {LoginScreen, RegisterScreen} from "@/features/auth";
import {useEffect} from "react";
import {trpc} from "@/lib/trpc";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  const utils = trpc.useContext();

  useEffect(() => {
    utils.invalidate();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none",
        statusBarColor: "#1E293B",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
