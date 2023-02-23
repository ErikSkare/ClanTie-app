import {useState, useEffect} from "react";
import {
  ActivityIndicator,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {trpc} from "@/lib/trpc";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {MainStackParamList} from "@/navigation/MainStack";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import ViewedBar from "../components/ViewedBar";
import Picture from "../components/Picture";

export type PictureScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "Picture"
>;

const PictureScreen: React.FC<PictureScreenProps> = ({navigation, route}) => {
  const utils = trpc.useContext();

  const [current, setCurrent] = useState(0);

  const {data, isLoading, isError} = trpc.picture.getByMember.useQuery(
    route.params,
    {onSuccess: () => setCurrent(0)}
  );

  const {mutate} = trpc.picture.saveToAlbum.useMutation({
    onMutate: async ({pictureId}) => {
      await utils.picture.getByMember.cancel(route.params);

      const previous = utils.picture.getByMember.getData(route.params);

      utils.picture.getByMember.setData(route.params, (old) => {
        if (!old) return;
        return {
          ...old,
          pictures: old.pictures.map((picture) => {
            return pictureId !== picture.id
              ? picture
              : {...picture, saved: true};
          }),
        };
      });

      return {previous};
    },
    onError: (error, data, ctx) => {
      utils.picture.getByMember.setData(route.params, ctx?.previous);
    },
    onSuccess: () => {
      utils.picture.getAlbumPictures.invalidate({clanId: route.params.clanId});
    },
  });

  const {mutate: markSeen} = trpc.picture.markSeen.useMutation();

  useEffect(() => {
    return () => {
      utils.picture.getByMember.reset(route.params);
    };
  }, []);

  function markSeenCurrentIfNeeded() {
    if (data && !data.seenAll) {
      markSeen({
        clanId: route.params.clanId,
        pictureId: data?.pictures[current]?.id as number,
      });
      if (current == (data?.pictures.length as number) - 1) {
        utils.clan.getById.setData({clanId: route.params.clanId}, (old) => {
          if (!old) return;
          return {
            ...old,
            members: old.members.map((member) => {
              return member.userId === route.params.userId
                ? {...member, content: {hasNew: false, hasAny: true}}
                : member;
            }),
          };
        });
      }
    }
  }

  function step() {
    markSeenCurrentIfNeeded();
    if (current == (data?.pictures.length as number) - 1) {
      navigation.goBack();
    } else {
      setCurrent((val) => val + 1);
    }
  }

  if (isLoading)
    return (
      <EmptyLayout
        className="justify-center items-center"
        backgroundClassName="bg-slate-900"
      >
        <ActivityIndicator color="white" size="large" />
      </EmptyLayout>
    );

  if (isError) return null;

  if (!data) {
    navigation.goBack();
    return null;
  }

  return (
    <EmptyLayout backgroundClassName="bg-slate-900">
      <Pressable className="h-full" onPress={step}>
        <ViewedBar
          length={data.pictures.length + data.offset}
          viewed={current + data.offset}
        />
        <View className="flex-1">
          <View className="w-full absolute top-4 px-4 flex-row justify-between items-center z-10">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                mutate({pictureId: data.pictures[current]?.id as number})
              }
              disabled={data.pictures[current]?.saved}
            >
              {data.pictures[current]?.saved ? (
                <AntDesign name="heart" size={24} color="red" />
              ) : (
                <AntDesign name="hearto" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <Picture
            className="flex-1"
            imageUrl={data.pictures[current]?.imageUrl as string}
            avatarUrl={data.pictures[current]?.sender.avatarUrl as string}
            nickname={data.pictures[current]?.sender.nickname as string}
            createdAt={data.pictures[current]?.createdAt as Date}
          />
        </View>
      </Pressable>
    </EmptyLayout>
  );
};

export default PictureScreen;
