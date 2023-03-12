import {View, Text, ViewProps, ActivityIndicator} from "react-native";
import {trpc} from "@/lib/trpc";
import {Members} from "@/features/clan";
import {useTokenStore} from "@/features/auth";
import Button from "@/components/Button";

interface AccountProps extends ViewProps {
  containerClassName?: string;
}

const Account: React.FC<AccountProps> = ({
  containerClassName = "",
  ...props
}) => {
  const {data, isLoading, isError} = trpc.user.meWithMemberships.useQuery(
    undefined,
    {staleTime: Infinity}
  );
  const logout = useTokenStore((state) => state.logout);

  if (isLoading)
    return (
      <View
        className={`bg-slate-800 items-center p-4 ${containerClassName}`}
        {...props}
      >
        <ActivityIndicator color="white" size="large" />
      </View>
    );

  if (isError) return null;

  return (
    <View
      className={`bg-slate-800 items-center p-4 ${containerClassName}`}
      {...props}
    >
      <Text
        className="text-lg text-white"
        style={{fontFamily: "Roboto_500Medium"}}
      >
        {data.lastName + " " + data.firstName}
      </Text>
      <Text className="text-slate-400 mb-2">{"(" + data.email + ")"}</Text>
      <Members
        containerClassName="grow-0 mb-8"
        data={data.memberships.map((value) => {
          return {avatarUrl: value.avatarUrl, user: {id: value.userId}};
        })}
      />
      <Button
        content="Kijelentkezés"
        color="danger"
        className="w-auto"
        onPress={logout}
      />
    </View>
  );
};

export default Account;
