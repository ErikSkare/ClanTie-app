import {View} from "react-native";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import {ClanTabParamList} from "@/navigation/ClanTab";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import Messages from "../components/Messages";

export type ChatScreenProps = BottomTabScreenProps<ClanTabParamList, "Chat">;

const ChatScreen: React.FC<ChatScreenProps> = ({navigation, route}) => {
  return (
    <EmptyLayout
      backgroundClassName="bg-slate-800"
      withSlideBackButton={true}
      goBack={() => navigation.getParent()?.goBack()}
    >
      <View className="flex-1 p-4 mt-[20px]">
        <Messages clanId={route.params.clanId} className="mt-4 flex-1" />
      </View>
    </EmptyLayout>
  );
};

export default ChatScreen;
