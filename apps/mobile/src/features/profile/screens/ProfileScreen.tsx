import Button from "@/components/Button";
import SplashScreen from "@/components/SplashScreen";
import useTokenStore from "@/features/auth/stores/useTokenStore";
import {trpc} from "@/lib/trpc";
import {MainStackParamList} from "@/navigation/MainStack";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {ScrollView, View, TouchableOpacity, Text} from "react-native";

export type RegisterScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "Profile"
>;

const ProfileScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const {data, isLoading, isError} = trpc.user.me.useQuery();

  const logout = useTokenStore((state) => state.logout);

  if (isLoading) return <SplashScreen />;

  if (isError) return <Text>Valami hiba történt!</Text>;

  return (
    <ScrollView
      className="bg-slate-700"
      contentContainerStyle={{height: "100%"}}
    >
      <View className="flex flex-1 items-center justify-center">
        <Text>{data.lastName + " " + data.firstName}</Text>
        <Button
          content="Klán alapítás"
          onPress={() => navigation.navigate("CreateClan")}
        />
        <TouchableOpacity onPress={() => logout()}>
          <Text>Kilépés</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
