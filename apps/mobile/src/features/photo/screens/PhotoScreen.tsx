import Camera from "../components/Camera";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import {ClanTabParamList} from "@/navigation/ClanTab";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";

export type PhotoScreenProps = BottomTabScreenProps<ClanTabParamList, "Photo">;

const PhotoScreen: React.FC<PhotoScreenProps> = () => {
  return (
    <EmptyLayout backgroundClassName="bg-slate-800">
      <Camera containerClassName="w-full h-full" />
    </EmptyLayout>
  );
};

export default PhotoScreen;
