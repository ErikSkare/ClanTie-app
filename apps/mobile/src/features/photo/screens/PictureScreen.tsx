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
  const {data, isLoading, isError} = trpc.picture.getByMember.useQuery(
    route.params
  );

  const [current, setCurrent] = useState(0);

  if (isLoading)
    return (
      <EmptyLayout className="justify-center items-center">
        <ActivityIndicator color="white" size="large" />
      </EmptyLayout>
    );

  if (isError) return null;

  function step() {
    if (current == (data?.length as number) - 1) navigation.goBack();
    else setCurrent((val) => val + 1);
  }

  return (
    <EmptyLayout backgroundClassName="bg-slate-900">
      <Pressable className="h-full" onPress={step}>
        <ViewedBar length={data.length} viewed={current} />
        <View className="flex-1">
          <TouchableOpacity
            className="absolute top-4 left-4 z-10"
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
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
