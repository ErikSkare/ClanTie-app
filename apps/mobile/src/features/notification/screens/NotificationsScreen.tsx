import EmptyLayout from "@/components/layouts/EmptyLayout";
import {MainStackParamList} from "@/navigation/MainStack";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

export type NotificationsScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "Notifications"
>;

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
}) => {
  return (
    <EmptyLayout
      withSlideBackButton={true}
      goBack={() => navigation.goBack()}
    ></EmptyLayout>
  );
};

export default NotificationsScreen;
