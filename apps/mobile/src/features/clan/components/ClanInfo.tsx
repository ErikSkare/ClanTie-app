import {View, Text, ViewProps, ActivityIndicator} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {MainStackParamList} from "@/navigation/MainStack";
import {trpc} from "@/lib/trpc";
import {useSubscription, useListen} from "@/features/ws";
import Members from "./Members";

interface ClanInfoProps extends ViewProps {
  clanId: number;
}

const ClanInfo: React.FC<ClanInfoProps> = ({clanId, ...props}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const utils = trpc.useContext();

  const {data, isLoading, isError} = trpc.clan.getById.useQuery({clanId});

  useListen(
    (s) => s.emit("clan:start", clanId),
    (s) => s.emit("clan:stop", clanId)
  );

  useSubscription("clan:user-online", (userId) => {
    utils.clan.getById.setData({clanId}, (old) => {
      if (!old) return;
      return {
        ...old,
        members: old.members.map((member) => {
          return member.userId === userId
            ? {...member, user: {...member.user, isActive: true}}
            : member;
        }),
      };
    });
  });

  useSubscription("clan:user-offline", (userId) => {
    utils.clan.getById.setData({clanId}, (old) => {
      if (!old) return;
      return {
        ...old,
        members: old.members.map((member) => {
          return member.userId === userId
            ? {...member, user: {...member.user, isActive: false}}
            : member;
        }),
      };
    });
  });

  useSubscription("clan:user-picture", (userId) => {
    utils.clan.getById.setData({clanId}, (old) => {
      if (!old) return;
      return {
        ...old,
        members: old.members.map((member) => {
          return member.userId === userId
            ? {...member, hasContent: true}
            : member;
        }),
      };
    });
  });

  useSubscription("clan:new-member", () => {
    utils.clan.getById.invalidate();
  });

  if (isError) return null;

  return (
    <View {...props}>
      {isLoading ? (
        <ActivityIndicator color="white" size="large" className="self-center" />
      ) : (
        <View>
          <Text
            className="text-white text-2xl mb-4"
            style={{fontFamily: "Roboto_700Bold"}}
          >
            {data.name}
          </Text>
          <Members
            data={data.members.map((member) => {
              return {
                ...member,
                hasContent: member.hasContent,
                onPress: () =>
                  navigation.navigate("Picture", {
                    clanId: member.clanId,
                    userId: member.userId,
                  }),
              };
            })}
            avatarSize="big"
          />
        </View>
      )}
    </View>
  );
};

export default ClanInfo;
