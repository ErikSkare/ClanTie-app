import Camera from "../components/Camera";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import {ClanTabParamList} from "@/navigation/ClanTab";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {trpc} from "@/lib/trpc";
import uriToFileMeta from "@/utils/uriToFileMeta";
import toFormData from "@/utils/toFormData";

export type PhotoScreenProps = BottomTabScreenProps<ClanTabParamList, "Photo">;

const PhotoScreen: React.FC<PhotoScreenProps> = ({navigation, route}) => {
  const clanId = route.params.clanId;

  const utils = trpc.useContext();
  const {mutateAsync} = trpc.picture.send.useMutation();

  async function sendPicture(pictureUri: string) {
    const {url, fields} = await mutateAsync({
      clanId,
    });

    const fileMeta = uriToFileMeta(pictureUri);
    if (!fileMeta) return;

    await fetch(url, {
      method: "POST",
      body: toFormData({
        ...fields,
        "Content-Type": fileMeta.type,
        file: fileMeta,
      }),
    });

    utils.clan.getById.invalidate({clanId});
    navigation.navigate("Location", {clanId});
  }

  return (
    <EmptyLayout backgroundClassName="bg-slate-800">
      <Camera containerClassName="w-full h-full" onPictureSend={sendPicture} />
    </EmptyLayout>
  );
};

export default PhotoScreen;
