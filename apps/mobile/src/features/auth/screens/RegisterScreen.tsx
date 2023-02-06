import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {AuthStackParamList} from "@/navigation/AuthStack";
import {Text, TouchableOpacity} from "react-native";
import RegisterForm from "../components/RegisterForm";
import EmptyLayout from "@/components/layouts/EmptyLayout";

export type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Register"
>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  return (
    <EmptyLayout className="flex justify-center items-center">
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
    </EmptyLayout>
  );
};

export default RegisterScreen;
