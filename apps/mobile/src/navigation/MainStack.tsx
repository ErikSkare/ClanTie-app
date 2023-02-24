import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {FeedScreen, SettingsScreen} from "@/features/profile";
import {
  CreateClanScreen,
  InviteScreen,
  AcceptInvitationScreen,
} from "@/features/clan";
import {NotificationsScreen} from "@/features/notification";
import {WebSocketProvider} from "@/features/ws";
import {MemoryScreen, PictureScreen} from "@/features/photo";
import ClanTab from "./ClanTab";
import {usePushToken} from "@/features/push";

export type MainStackParamList = {
  Feed: undefined;
  CreateClan: undefined;
  Invite: {clanId: number};
  AcceptInvitation: {fromId: number; clanId: number};
  Settings: undefined;
  Notifications: undefined;
  Clan: {clanId: number};
  Picture: {clanId: number; userId: number};
  Memory: {pictureId: number};
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  usePushToken();

  return (
    <WebSocketProvider>
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
          options={{animation: "fade_from_bottom"}}
        />
        <Stack.Screen
          name="Invite"
          component={InviteScreen}
          options={{animation: "fade_from_bottom"}}
        />
        <Stack.Screen
          name="AcceptInvitation"
          component={AcceptInvitationScreen}
          options={{animation: "fade_from_bottom"}}
        />
        <Stack.Screen name="Clan" component={ClanTab} />
        <Stack.Screen name="Picture" component={PictureScreen} />
        <Stack.Screen
          name="Memory"
          component={MemoryScreen}
          options={{animation: "fade_from_bottom"}}
        />
      </Stack.Navigator>
    </WebSocketProvider>
  );
};

export default MainStack;
