import {NativeStackScreenProps} from "@react-navigation/native-stack";
import MainLayout from "@/components/layouts/MainLayout";
import {MainStackParamList} from "@/navigation/MainStack";
import Account from "../components/Account";

export type SettingsScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "Settings"
>;

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  return (
    <MainLayout>
      <Account />
    </MainLayout>
  );
};

export default SettingsScreen;
