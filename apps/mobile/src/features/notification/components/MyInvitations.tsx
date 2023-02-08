import {trpc} from "@/lib/trpc";
import {View, Text, ViewProps, ActivityIndicator} from "react-native";
import ReceivedInvitation from "./ReceivedInvitation";

const MyInvitations: React.FC<ViewProps> = () => {
  const {data, isLoading, isError} =
    trpc.notification.getReceivedInvitations.useQuery();

  if (isError) return null;

  return (
    <View>
      <Text
        className="text-xl text-white mb-8"
        style={{fontFamily: "Roboto_700Bold"}}
      >
        Függő meghívások
      </Text>
      {isLoading ? (
        <ActivityIndicator color="white" size="large" />
      ) : (
        <>
          {data.map((invitation, key) => (
            <ReceivedInvitation
              key={key}
              from={{
                firstName: invitation.fromUser.firstName,
                lastName: invitation.fromUser.lastName,
                id: invitation.fromUser.id,
              }}
              clan={{
                name: invitation.clan.name,
                id: invitation.clan.id,
              }}
              when={invitation.createdAt}
            />
          ))}
          <View className="border-t-2 border-slate-600"></View>
        </>
      )}
    </View>
  );
};

export default MyInvitations;
