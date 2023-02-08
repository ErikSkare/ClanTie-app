import {View, Text, ViewProps} from "react-native";
import TimeAgo from "javascript-time-ago";
import {trpc} from "@/lib/trpc";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {MainStackParamList} from "@/navigation/MainStack";
import Button from "@/components/Button";

interface ReceivedInvitationProps extends ViewProps {
  from: {
    firstName: string;
    lastName: string;
    id: number;
  };
  clan: {
    name: string;
    id: number;
  };
  when: Date;
  containerClassName?: string;
}

const ReceivedInvitation: React.FC<ReceivedInvitationProps> = ({
  from,
  clan,
  when,
  containerClassName = "",
  ...props
}) => {
  const utils = trpc.useContext();

  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const {mutate: declineInvitation} = trpc.clan.declineInvitation.useMutation({
    onMutate: async ({clanId, fromId}) => {
      await utils.notification.getReceivedInvitations.cancel();

      const previousInvitations =
        utils.notification.getReceivedInvitations.getData();

      utils.notification.getReceivedInvitations.setData(undefined, (old) => {
        if (!old) return undefined;
        return old.filter(
          (current) => current.clanId != clanId || current.fromUserId != fromId
        );
      });

      return {previousInvitations};
    },
    onError: (error, data, ctx) => {
      utils.notification.getReceivedInvitations.setData(
        undefined,
        ctx?.previousInvitations
      );
    },
    onSettled: () => {
      utils.notification.getReceivedInvitations.invalidate();
    },
  });

  const timeAgo = new TimeAgo("hu");

  return (
    <View
      className={`border-t-2 border-slate-600 py-4 ${containerClassName}`}
      {...props}
    >
      <Text
        className="text-slate-200 text-base"
        style={{fontFamily: "Roboto_700Bold"}}
      >
        {from.lastName + " " + from.firstName + " "}
      </Text>
      <Text className="text-slate-400 mb-2">
        <Text style={{fontFamily: "Roboto_400Regular"}}>meghívott a(z)</Text>
        <Text style={{fontFamily: "Roboto_500Medium"}}>
          {" " + clan.name + " "}
        </Text>
        <Text style={{fontFamily: "Roboto_400Regular"}}>
          elnevezésű klánba!
        </Text>
      </Text>
      <Text
        className="text-slate-200 text-xs mb-6"
        style={{fontFamily: "Roboto_400Regular"}}
      >
        {timeAgo.format(when)}
      </Text>
      <View className="flex flex-row gap-6">
        <Button
          content="Elfogadás"
          size="small"
          onPress={() =>
            navigation.navigate("AcceptInvitation", {
              clanId: clan.id,
              fromId: from.id,
            })
          }
        />
        <Button
          content="Elutasítás"
          size="small"
          shape="secondary"
          onPress={() => declineInvitation({clanId: clan.id, fromId: from.id})}
        />
      </View>
    </View>
  );
};

export default ReceivedInvitation;
