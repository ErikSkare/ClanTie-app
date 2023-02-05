import {MainStackParamList} from "@/navigation/MainStack";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {TouchableOpacity, View, Text} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import CreateClanForm from "../components/CreateClanForm";

export type CreateClanScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "CreateClan"
>;

const CreateClanScreen: React.FC<CreateClanScreenProps> = ({navigation}) => {
  return (
    <View className="bg-slate-700 height-screen flex flex-1 items-center justify-center">
      <TouchableOpacity
        className="absolute top-4 left-4"
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="close" size={24} color="white" />
      </TouchableOpacity>
      <Text
        className="text-2xl text-white"
        style={{fontFamily: "Roboto_700Bold"}}
      >
        Klán alapítás
      </Text>
      <CreateClanForm className="w-full px-8 mt-8" />
    </View>
  );
};

export default CreateClanScreen;
