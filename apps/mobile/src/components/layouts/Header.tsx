import {View, Text, ViewProps, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {MainStackParamList} from "@/navigation/MainStack";
import {NotificationBell} from "@/features/notification";

const Header: React.FC<ViewProps> = ({className = "", ...props}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <View
      className={`w-full p-4 flex flex-row justify-between items-center ${className}`}
      {...props}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Feed")}>
        <View className="flex flex-row">
          <Text
            className="text-slate-400 text-lg"
            style={{fontFamily: "Roboto_400Regular"}}
          >
            Clan
          </Text>
          <Text
            className="text-slate-400 text-lg"
            style={{fontFamily: "Roboto_700Bold"}}
          >
            Tie
          </Text>
        </View>
      </TouchableOpacity>
      <View className="flex flex-row items-center">
        <NotificationBell className="mr-6" />
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-sharp" size={24} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
