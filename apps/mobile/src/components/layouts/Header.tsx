import {
  View,
  Text,
  ViewProps,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
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
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => navigation.navigate("Feed")}>
          <View className="flex flex-row">
            <Text
              className="text-slate-400 text-base"
              style={{fontFamily: "Roboto_400Regular"}}
            >
              Clan
            </Text>
            <Text
              className="text-slate-400 text-base"
              style={{fontFamily: "Roboto_700Bold"}}
            >
              Tie
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-2 bg-blue-400 rounded ml-2"
          onPress={() =>
            Alert.alert(
              "Az applikáció még béta állapotban van!",
              "Minden jellegű észrevételt/ötletet szívesen várok!",
              [
                {
                  text: "Üzenet küldés",
                  onPress: () =>
                    Linking.openURL(
                      "mailto:skareerik55@gmail.com?subject=ClanTie - Észrevétel/ötlet"
                    ),
                },
                {
                  text: "Bezárás",
                  style: "cancel",
                },
              ],
              {cancelable: true}
            )
          }
        >
          <Text
            className="uppercase text-white text-xs"
            style={{fontFamily: "Roboto_700Bold"}}
          >
            BETA
          </Text>
        </TouchableOpacity>
      </View>
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
