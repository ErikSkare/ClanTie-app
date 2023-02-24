import * as Location from "expo-location";
import {ClanTabParamList} from "@/navigation/ClanTab";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {useLocation} from "@/features/location";
import Camera from "../components/Camera";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import {trpc} from "@/lib/trpc";
import {useState} from "react";
import uploadToS3 from "@/utils/uploadToS3";

export type PhotoScreenProps = BottomTabScreenProps<ClanTabParamList, "Photo">;

const PhotoScreen: React.FC<PhotoScreenProps> = ({navigation, route}) => {
  const clanId = route.params.clanId;

  const utils = trpc.useContext();
  const {mutateAsync} = trpc.picture.send.useMutation();

  const [isSending, setIsSending] = useState(false);

  const hasLocationPermission = useLocation(() => navigation.goBack());

  async function sendPicture(pictureUri: string) {
    try {
      setIsSending(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const upload = await mutateAsync({
        clanId,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      await uploadToS3(pictureUri, upload);

      setIsSending(false);
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
        isLoading={isSending}
      />
    </EmptyLayout>
  );
};

export default PhotoScreen;
