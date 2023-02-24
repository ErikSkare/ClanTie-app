import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Feather, Octicons, Ionicons} from "@expo/vector-icons";
import {AlbumScreen, PhotoScreen} from "@/features/photo";
import {LocationScreen} from "@/features/location";
import {ChatScreen} from "@/features/chat";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {MainStackParamList} from "./MainStack";

export type ClanTabParamList = {
  Photo: {clanId: number};
  Location: {clanId: number};
  Album: {clanId: number};
  Chat: {clanId: number};
};

const Tab = createBottomTabNavigator<ClanTabParamList>();

type ClanTabProps = NativeStackScreenProps<MainStackParamList, "Clan">;

const ClanTab: React.FC<ClanTabProps> = ({route}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveBackgroundColor: "black",
        tabBarInactiveBackgroundColor: "black",
        tabBarActiveTintColor: "#4ADE80",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {borderTopWidth: 0},
        tabBarShowLabel: false,
        headerShown: false,
      }}
      sceneContainerStyle={{backgroundColor: "#0f172a"}}
      initialRouteName="Location"
      backBehavior="history"
    >
      <Tab.Screen
        name="Location"
        component={LocationScreen}
        initialParams={{clanId: route.params.clanId}}
        options={{
          tabBarIcon: ({color}) => (
            <Octicons name="location" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={28}
              color={color}
            />
          ),
        }}
        initialParams={{clanId: route.params.clanId}}
      />
      <Tab.Screen
        name="Photo"
        component={PhotoScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Feather name="camera" size={28} color={color} />
          ),
          unmountOnBlur: true,
        }}
        initialParams={{clanId: route.params.clanId}}
      />
      <Tab.Screen
        name="Album"
        component={AlbumScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="albums-outline" size={28} color={color} />
          ),
        }}
        initialParams={{clanId: route.params.clanId}}
      />
    </Tab.Navigator>
  );
};

export default ClanTab;
