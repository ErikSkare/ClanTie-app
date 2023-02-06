import {MainStackParamList} from "@/navigation/MainStack";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {Text} from "react-native";
import CreateClanForm from "../components/CreateClanForm";
import EmptyLayout from "@/components/layouts/EmptyLayout";

export type CreateClanScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "CreateClan"
>;

const CreateClanScreen: React.FC<CreateClanScreenProps> = ({navigation}) => {
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
      <CreateClanForm className="w-full px-8 mt-8" />
    </EmptyLayout>
  );
};

export default CreateClanScreen;
