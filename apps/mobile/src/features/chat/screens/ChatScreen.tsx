import {View, KeyboardAvoidingView, Platform} from "react-native";
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
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <Messages clanId={route.params.clanId} className="mt-4 flex-1" />
        </KeyboardAvoidingView>
      </View>
    </EmptyLayout>
  );
};

export default ChatScreen;
