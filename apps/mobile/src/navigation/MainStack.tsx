import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {FeedScreen} from "@/features/profile";
import {CreateClanScreen} from "@/features/clan/";

export type MainStackParamList = {
  Feed: undefined;
  CreateClan: undefined;
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
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen
        name="CreateClan"
        component={CreateClanScreen}
        options={{animation: "slide_from_bottom"}}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
