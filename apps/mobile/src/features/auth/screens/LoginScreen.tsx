import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {AuthStackParamList} from "@/navigation/AuthStack";
import {Text, TouchableOpacity} from "react-native";
import LoginForm from "../components/LoginForm";
import EmptyLayout from "@/components/layouts/EmptyLayout";

export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Login"
>;

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  return (
    <EmptyLayout className="flex justify-center items-center">
      <Text
        className="text-2xl text-white"
        style={{fontFamily: "Roboto_700Bold"}}
      >
        Köszöntünk újra!
      </Text>
      <LoginForm className="w-full px-8 my-8" />
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text
          className="text-blue-400"
          style={{fontFamily: "Roboto_400Regular"}}
        >
          Még nincs fiókod?
        </Text>
      </TouchableOpacity>
    </EmptyLayout>
  );
};

export default LoginScreen;
