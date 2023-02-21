import * as Location from "expo-location";
import {ClanTabParamList} from "@/navigation/ClanTab";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {useLocation} from "@/features/location";
import Camera from "../components/Camera";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import {trpc} from "@/lib/trpc";
import uriToFileMeta from "@/utils/uriToFileMeta";
import toFormData from "@/utils/toFormData";

export type PhotoScreenProps = BottomTabScreenProps<ClanTabParamList, "Photo">;

const PhotoScreen: React.FC<PhotoScreenProps> = ({navigation, route}) => {
  const clanId = route.params.clanId;

  const utils = trpc.useContext();
  const {mutateAsync} = trpc.picture.send.useMutation();

  const hasLocationPermission = useLocation(() => navigation.goBack());

  async function sendPicture(pictureUri: string) {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const {url, fields} = await mutateAsync({
        clanId,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
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
    } catch (err) {
      navigation.goBack();
    }
  }

  if (!hasLocationPermission) return null;

  return (
    <EmptyLayout backgroundClassName="bg-slate-800">
      <Camera
        containerClassName="w-full h-full"
        onPictureSend={sendPicture}
        onPermissionDenied={async () => navigation.goBack()}
      />
    </EmptyLayout>
  );
};

export default PhotoScreen;
