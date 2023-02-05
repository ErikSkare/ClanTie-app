import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {AuthStackParamList} from "@/navigation/AuthStack";
import {View, Text, TouchableOpacity} from "react-native";
import RegisterForm from "../components/RegisterForm";

export type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Register"
>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  return (
    <View className="bg-slate-700 height-screen flex flex-1 items-center justify-center">
      <Text
        className="text-2xl text-white"
        style={{fontFamily: "Roboto_700Bold"}}
      >
        Fiók létrehozása
      </Text>
      <RegisterForm className="w-full px-8 my-8" />
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text
          className="text-blue-400"
          style={{fontFamily: "Roboto_400Regular"}}
        >
          Már van fiókod?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
