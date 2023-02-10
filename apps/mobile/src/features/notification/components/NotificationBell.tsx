import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  Text,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {MainStackParamList} from "@/navigation/MainStack";
import {trpc} from "@/lib/trpc";
import useSubscription from "@/ws/useSubscription";

const NotificationBell: React.FC<TouchableOpacityProps> = ({...props}) => {
  const utils = trpc.useContext();

  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const {data, isLoading, isError} =
    trpc.notification.getReceivedInvitations.useQuery();

  useSubscription("newInvitation", (data) => {
    utils.notification.getReceivedInvitations.setData(undefined, (old) =>
      old
        ? [...old, {...data, createdAt: new Date(data.createdAt)}]
        : [{...data, createdAt: new Date(data.createdAt)}]
    );
  });

  if (isError) return null;

  return (
    <TouchableOpacity
      {...props}
      onPress={() => navigation.navigate("Notifications")}
    >
      <Ionicons name="notifications" size={24} color="#94A3B8" />
      <View className="flex justify-center items-center absolute top-0 right-0 w-[16px] h-[16px] rounded-full bg-green-400 translate-x-[4px] -translate-y-[4px]">
        <Text
          className="text-white"
          style={{fontSize: 10, fontFamily: "Roboto_700Bold"}}
        >
          {isLoading ? "" : data.length}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationBell;
