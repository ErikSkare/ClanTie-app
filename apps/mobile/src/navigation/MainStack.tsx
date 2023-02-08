import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {FeedScreen, SettingsScreen} from "@/features/profile";
import {
  CreateClanScreen,
  InviteScreen,
  AcceptInvitationScreen,
} from "@/features/clan/";
import {NotificationsScreen} from "@/features/notification";

export type MainStackParamList = {
  Feed: undefined;
  CreateClan: undefined;
  Invite: {clanId: number};
  AcceptInvitation: {fromId: number; clanId: number};
  Settings: undefined;
  Notifications: undefined;
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
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{animation: "slide_from_left"}}
      />
      <Stack.Screen
        name="CreateClan"
        component={CreateClanScreen}
        options={{animation: "slide_from_bottom"}}
      />
      <Stack.Screen
        name="Invite"
        component={InviteScreen}
        options={{animation: "slide_from_bottom"}}
      />
      <Stack.Screen
        name="AcceptInvitation"
        component={AcceptInvitationScreen}
        options={{animation: "slide_from_bottom"}}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
