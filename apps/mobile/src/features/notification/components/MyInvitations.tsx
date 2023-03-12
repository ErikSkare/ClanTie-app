import {trpc} from "@/lib/trpc";
import {View, Text, ViewProps, ActivityIndicator, FlatList} from "react-native";
import ReceivedInvitation from "./ReceivedInvitation";

const MyInvitations: React.FC<ViewProps> = ({className = "", ...props}) => {
  const {data, isLoading, isError, isRefetching, refetch} =
    trpc.notification.getReceivedInvitations.useQuery();

  if (isError) return null;

  return (
    <View className={`flex-1 ${className}`} {...props}>
      <Text
        className="text-xl text-white mb-8"
        style={{fontFamily: "Roboto_700Bold"}}
      >
        Függő meghívások
      </Text>
      {isLoading ? (
        <ActivityIndicator color="white" size="large" />
      ) : (
        <FlatList
          ListEmptyComponent={() => (
            <Text
              className="text-slate-400"
              style={{fontFamily: "Roboto_400Regular"}}
            >
              Sajnos nincsenek meghívásaid!
            </Text>
          )}
          refreshing={isRefetching}
          keyExtractor={(item) =>
            `invitation-${item.clanId}-${item.fromUserId}-${item.toUserId}`
          }
          onRefresh={() => refetch()}
          data={data}
          renderItem={({item}) => (
            <ReceivedInvitation
              from={{
                firstName: item.fromUser.firstName,
                lastName: item.fromUser.lastName,
                id: item.fromUser.id,
              }}
              clan={{
                name: item.clan.name,
                id: item.clan.id,
              }}
              when={item.createdAt}
            />
          )}
          ItemSeparatorComponent={() => (
            <View className="border-t-2 border-slate-600" />
          )}
        />
      )}
    </View>
  );
};

export default MyInvitations;
