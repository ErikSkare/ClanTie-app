import {ActivityIndicator, Image, View} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {MainStackParamList} from "@/navigation/MainStack";
import {trpc} from "@/lib/trpc";
import EmptyLayout from "@/components/layouts/EmptyLayout";

export type PictureScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "Picture"
>;

const PictureScreen: React.FC<PictureScreenProps> = ({navigation, route}) => {
  const pictureId = route.params.pictureId;

  const {data, isLoading, isError} = trpc.picture.getById.useQuery(
    {pictureId},
    {staleTime: Infinity}
  );

  if (isLoading)
    return (
      <EmptyLayout className="justify-center items-center">
        <ActivityIndicator color="white" size="large" />
      </EmptyLayout>
    );

  if (isError) return null;

  return (
    <EmptyLayout
      backgroundClassName="bg-slate-800"
      withCloseButton={true}
      goBack={() => navigation.goBack()}
    >
      <View>
        <Image
          source={{uri: data.imageUrl}}
          className="w-screen h-screen"
          resizeMode="contain"
        />
      </View>
    </EmptyLayout>
  );
};

export default PictureScreen;
