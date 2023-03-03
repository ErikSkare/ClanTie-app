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
    <MapboxGL.MarkerView coordinate={coordinates} allowOverlap={true}>
      <View className="flex-row m-[10px] max-w-[80] flex-wrap">
        {avatarUrls.map((url, key) => (
          <Avatar key={key} imageUrl={url} className="m-[-10px]" />
        ))}
      </View>
    </MapboxGL.MarkerView>
  );
};

export default ClusterMarker;
