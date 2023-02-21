import {View} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import Avatar from "@/components/Avatar";

interface ClusterMarkerProps {
  coordinates: number[];
  avatarUrls: string[];
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  coordinates,
  avatarUrls,
}) => {
  return (
    <MapboxGL.MarkerView coordinate={coordinates}>
      <View className="flex-row mx-[12px]">
        {avatarUrls.map((url, key) => (
          <Avatar key={key} imageUrl={url} className="mx-[-12px]" />
        ))}
      </View>
    </MapboxGL.MarkerView>
  );
};

export default ClusterMarker;
