import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Feather, Octicons} from "@expo/vector-icons";
import {PhotoScreen} from "@/features/photo";
import {LocationScreen} from "@/features/location";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {MainStackParamList} from "./MainStack";

export type ClanTabParamList = {
  Photo: {clanId: number};
  Location: {clanId: number};
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
    </Tab.Navigator>
  );
};

export default ClanTab;
