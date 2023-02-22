import {useState} from "react";
import {
  ActivityIndicator,
  Image,
  View,
  TouchableOpacity,
  Pressable,
  Text,
} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {MainStackParamList} from "@/navigation/MainStack";
import {trpc} from "@/lib/trpc";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import ViewedBar from "../components/ViewedBar";
import {AntDesign} from "@expo/vector-icons";
import Avatar from "@/components/Avatar";
import TimeAgo from "@/components/TimeAgo";

export type PictureScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "Picture"
>;

const PictureScreen: React.FC<PictureScreenProps> = ({navigation, route}) => {
  const utils = trpc.useContext();

  const {data, isLoading, isError} = trpc.picture.getByMember.useQuery(
    route.params
  );

  const {mutate} = trpc.picture.saveToAlbum.useMutation({
    onMutate: async ({pictureId}) => {
      await utils.picture.getByMember.cancel(route.params);

      const previous = utils.picture.getByMember.getData(route.params);

      utils.picture.getByMember.setData(route.params, (old) => {
        return (old ?? []).map((picture) => {
          return pictureId !== picture.id ? picture : {...picture, saved: true};
        });
      });

      return {previous};
    },
    onError: (error, data, ctx) => {
      utils.picture.getByMember.setData(route.params, ctx?.previous);
    },
    onSuccess: () => {
      utils.picture.getAlbumPictures.invalidate();
    },
    onSettled: () => {
      utils.picture.getByMember.invalidate();
    },
  });

  const [current, setCurrent] = useState(0);

  if (isLoading)
    return (
      <EmptyLayout className="justify-center items-center">
        <ActivityIndicator color="white" size="large" />
      </EmptyLayout>
    );

  if (isError) return null;

  if (!data) {
    navigation.goBack();
    return null;
  }

  function step() {
    if (current == (data?.length as number) - 1) navigation.goBack();
    else setCurrent((val) => val + 1);
  }

  return (
    <EmptyLayout backgroundClassName="bg-slate-900">
      <Pressable className="h-full" onPress={step}>
        <ViewedBar length={data.length} viewed={current} />
        <View className="flex-1">
          <View className="w-full absolute top-4 px-4 flex-row justify-between items-center z-10">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => mutate({pictureId: data[current]?.id as number})}
              disabled={data[current]?.saved}
            >
              {data[current]?.saved ? (
                <AntDesign name="heart" size={24} color="red" />
              ) : (
                <AntDesign name="hearto" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <Image
            source={{uri: data[current]?.imageUrl}}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        <View className="absolute bottom-4 px-4 z-10 w-full flex-row justify-between items-center">
          <View className="flex-row items-center gap-4">
            <Avatar
              imageUrl={data[current]?.sender.avatarUrl as string}
              size="big"
            />
            <Text
              className="text-white text-lg"
              style={{fontFamily: "Roboto_500Medium"}}
            >
              {data[current]?.sender.nickname}
            </Text>
          </View>
          <TimeAgo
            date={data[current]?.createdAt as Date}
            className="text-slate-400"
            style={{fontFamily: "Roboto_400Regular"}}
          />
        </View>
      </Pressable>
    </EmptyLayout>
  );
};

export default PictureScreen;
