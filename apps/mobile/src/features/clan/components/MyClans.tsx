import {ActivityIndicator, FlatList, View, Text} from "react-native";
import {trpc} from "@/lib/trpc";
import {ViewProps} from "react-native";
import ClanCard from "./ClanCard";

interface MyClansProps extends ViewProps {
  containerClassName?: string;
}

const MyClans: React.FC<MyClansProps> = ({containerClassName, ...props}) => {
  const {data, isLoading, isError, isRefetching} = trpc.clan.getAll.useQuery();

  if (isLoading)
    return (
      <View
        className={`flex items-center justify-center ${containerClassName}`}
        {...props}
      >
        <ActivityIndicator color="white" size="large" />
      </View>
    );

  if (isError) return null;

  if (data.length == 0)
    return (
      <View
        className={`flex items-center justify-center ${containerClassName}`}
        {...props}
      >
        <Text
          className="text-lg text-white"
          style={{fontFamily: "Roboto_500Medium"}}
        >
          Még nincsenek klánjaid!
        </Text>
      </View>
    );

  return (
    <View
      className={`flex items-center justify-center ${containerClassName}`}
      {...props}
    >
      {isRefetching && (
        <ActivityIndicator color="white" size="large" className="mb-4" />
      )}
      <FlatList
        data={data}
        className="w-full"
        renderItem={(clan) => (
          <ClanCard
            className="my-2"
            clanName={clan.item.name}
            members={clan.item.members.map((member) => {
              return {avatarUrl: member.avatarUrl};
            })}
          />
        )}
      />
    </View>
  );
};

export default MyClans;
