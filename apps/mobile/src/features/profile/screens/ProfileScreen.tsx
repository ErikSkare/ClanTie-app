import Button from "@/components/Button";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import useTokenStore from "@/features/auth/stores/useTokenStore";
import {MainStackParamList} from "@/navigation/MainStack";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {TouchableOpacity, Text} from "react-native";

export type RegisterScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "Profile"
>;

const ProfileScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const logout = useTokenStore((state) => state.logout);

  return (
    <EmptyLayout className="flex justify-center items-center">
      <Button
        content="Klán alapítás"
        onPress={() => navigation.navigate("CreateClan")}
      />
      <TouchableOpacity onPress={() => logout()}>
        <Text>Kilépés</Text>
      </TouchableOpacity>
    </EmptyLayout>
  );
};

export default ProfileScreen;
