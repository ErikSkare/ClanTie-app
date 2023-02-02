import {ScrollView, View, Text, TouchableOpacity} from "react-native";
import RegisterForm from "../components/RegisterForm";

const RegisterScreen = () => {
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
          Fiók létrehozása
        </Text>
        <RegisterForm className="w-full px-8 my-8" />
        <TouchableOpacity>
          <Text
            className="text-blue-400"
            style={{fontFamily: "Roboto_400Regular"}}
          >
            Már van fiókod?
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
