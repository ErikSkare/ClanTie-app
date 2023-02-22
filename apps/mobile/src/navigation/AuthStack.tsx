import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {LoginScreen, RegisterScreen} from "@/features/auth";
import {useEffect} from "react";
import {useQueryClient} from "@tanstack/react-query";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.clear();
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
