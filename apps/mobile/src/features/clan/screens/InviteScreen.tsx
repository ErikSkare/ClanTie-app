import {Text} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {MainStackParamList} from "@/navigation/MainStack";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import InviteForm from "../components/InviteForm";

export type InviteScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "Invite"
>;

const InviteScreen: React.FC<InviteScreenProps> = ({navigation, route}) => {
  return (
    <EmptyLayout
      className="justify-center items-center"
      withCloseButton={true}
      goBack={() => navigation.goBack()}
    >
      <Text
        className="text-2xl text-white"
        style={{fontFamily: "Roboto_700Bold"}}
      >
        Meghívás a klánba
      </Text>
      <InviteForm className="w-full px-8 mt-8" clanId={route.params.clanId} />
    </EmptyLayout>
  );
};

export default InviteScreen;
