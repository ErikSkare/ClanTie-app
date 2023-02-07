import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {View, Text, ActivityIndicator} from "react-native";
import {trpc} from "@/lib/trpc";
import Button from "@/components/Button";
import MainLayout from "@/components/layouts/MainLayout";
import useTokenStore from "@/features/auth/stores/useTokenStore";
import {MainStackParamList} from "@/navigation/MainStack";
import Members from "@/features/clan/components/Members";

export type SettingsScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "Settings"
>;

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const logout = useTokenStore((state) => state.logout);

  const {data, isLoading, isError} = trpc.user.meWithMemberships.useQuery();

  if (isError) return null;

  if (isLoading)
    return (
      <MainLayout>
        <ActivityIndicator size="large" color="white" />
      </MainLayout>
    );

  return (
    <MainLayout>
      <View className="flex-1 items-center p-8">
        <Text
          className="text-lg text-white mb-2"
          style={{fontFamily: "Roboto_500Medium"}}
        >
          {data.lastName + " " + data.firstName}
        </Text>
        <Members
          containerClassName="grow-0 mb-8"
          data={data.memberships.map((value) => {
            return {avatarUrl: value.avatarUrl};
          })}
        />
        <Button
          content="Kijelentkezés"
          color="danger"
          className="w-auto"
          onPress={logout}
        />
      </View>
    </MainLayout>
  );
};

export default SettingsScreen;
