import {View, ViewProps, Text, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {MainStackParamList} from "@/navigation/MainStack";
import Members, {MemberData} from "./Members";

interface ClanCardProps extends ViewProps {
  clanId: number;
  clanName: string;
  members: MemberData[];
  containerClassName?: string;
}

const ClanCard: React.FC<ClanCardProps> = ({
  clanId,
  clanName,
  members,
  containerClassName = "",
  ...props
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <View className={`p-4 bg-slate-800 ${containerClassName}`} {...props}>
      <View className="flex-row justify-between items-center mb-4">
        <Text
          className="text-lg text-white"
          style={{fontFamily: "Roboto_500Medium"}}
        >
          {clanName}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Invite", {clanId})}
        >
          <Ionicons name="person-add" size={24} color="#94A3B8" />
        </TouchableOpacity>
      </View>
      <Members data={members} />
    </View>
  );
};

export default ClanCard;
