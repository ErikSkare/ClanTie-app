import {View} from "react-native";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import {MainStackParamList} from "@/navigation/MainStack";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import MyInvitations from "../components/MyInvitations";

export type NotificationsScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "Notifications"
>;

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
}) => {
  return (
    <EmptyLayout withSlideBackButton={true} goBack={() => navigation.goBack()}>
      <View className="flex-1 mt-16 p-4">
        <MyInvitations />
      </View>
    </EmptyLayout>
  );
};

export default NotificationsScreen;
