import {MainStackParamList} from "@/navigation/MainStack";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {Text} from "react-native";
import CreateClanForm from "../components/CreateClanForm";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import {trpc} from "@/lib/trpc";

export type CreateClanScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "CreateClan"
>;

const CreateClanScreen: React.FC<CreateClanScreenProps> = ({navigation}) => {
  const utils = trpc.useContext();

  function onSuccess() {
    utils.clan.getAll.invalidate();
    utils.user.meWithMemberships.invalidate();
    navigation.goBack();
  }

  return (
    <EmptyLayout
      className="flex justify-center items-center"
      withCloseButton={true}
      goBack={navigation.goBack}
    >
      <Text
        className="text-2xl text-white"
        style={{fontFamily: "Roboto_700Bold"}}
      >
        Klán alapítás
      </Text>
      <CreateClanForm className="w-full px-8 mt-8" onSuccess={onSuccess} />
    </EmptyLayout>
  );
};

export default CreateClanScreen;
