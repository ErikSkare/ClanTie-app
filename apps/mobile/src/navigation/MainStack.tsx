import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ProfileScreen from "@/features/profile";

export type MainStackParamList = {
  Profile: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none",
        statusBarColor: "#1E293B",
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
