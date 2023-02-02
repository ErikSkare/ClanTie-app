import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {AuthStackParamList} from "@/navigation/AuthStack";
import {ScrollView, View, Text, TouchableOpacity} from "react-native";
import LoginForm from "../components/LoginForm";

export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Login"
>;

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  return (
    <ScrollView
      className="bg-slate-700"
      contentContainerStyle={{height: "100%"}}
    >
      <View className="flex flex-1 items-center justify-center">
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
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
