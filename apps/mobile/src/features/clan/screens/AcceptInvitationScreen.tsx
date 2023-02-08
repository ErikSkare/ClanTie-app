import {Text} from "react-native";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import {MainStackParamList} from "@/navigation/MainStack";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import AcceptInvitationForm from "../components/AcceptInvitationForm";
import {trpc} from "@/lib/trpc";

export type AcceptInvitationScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "AcceptInvitation"
>;

const AcceptInvitationScreen: React.FC<AcceptInvitationScreenProps> = ({
  navigation,
  route,
}) => {
  const utils = trpc.useContext();

  function onSuccess() {
    utils.clan.getAll.invalidate();
    utils.user.meWithMemberships.invalidate();
    utils.notification.getReceivedInvitations.invalidate();
    navigation.goBack();
  }

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
        Meghívás elfogadása
      </Text>
      <AcceptInvitationForm
        className="w-full px-8 mt-8"
        onSuccess={onSuccess}
        clanId={route.params.clanId}
        fromId={route.params.fromId}
      />
    </EmptyLayout>
  );
};

export default AcceptInvitationScreen;
