import Button from "@/components/Button";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import useTokenStore from "@/features/auth/stores/useTokenStore";
import {MainStackParamList} from "@/navigation/MainStack";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {TouchableOpacity, Text} from "react-native";
import MyClans from "@/features/clan/components/MyClans";

export type FeedScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "Feed"
>;

const FeedScreen: React.FC<FeedScreenProps> = ({navigation}) => {
  const logout = useTokenStore((state) => state.logout);

  return (
    <EmptyLayout className="flex justify-center items-center">
      <MyClans containerClassName="w-full flex-1" />
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

export default FeedScreen;
