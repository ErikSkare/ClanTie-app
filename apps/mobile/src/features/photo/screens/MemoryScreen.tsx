import {ActivityIndicator, Pressable} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {MainStackParamList} from "@/navigation/MainStack";
import {trpc} from "@/lib/trpc";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import Picture from "../components/Picture";

export type MemoryScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "Memory"
>;

const MemoryScreen: React.FC<MemoryScreenProps> = ({navigation, route}) => {
  const {data, isLoading, isError} = trpc.picture.getById.useQuery({
    pictureId: route.params.pictureId,
  });

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
    <EmptyLayout
      withCloseButton={true}
      goBack={() => navigation.goBack()}
      backgroundClassName="bg-slate-900"
    >
      <Pressable className="flex-1" onPress={() => navigation.goBack()}>
        <Picture
          className="flex-1"
          imageUrl={data.imageUrl}
          avatarUrl={data.sender.avatarUrl}
          nickname={data.sender.nickname}
          createdAt={data.createdAt}
        />
      </Pressable>
    </EmptyLayout>
  );
};

export default MemoryScreen;
