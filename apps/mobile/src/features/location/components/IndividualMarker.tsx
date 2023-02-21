import {View, Text} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import Avatar from "@/components/Avatar";
import TimeAgo from "@/components/TimeAgo";

interface IndividualMarkerProps {
  coordinates: number[];
  avatarUrl: string;
  nickname: string;
  when: Date;
}

const IndividualMarker: React.FC<IndividualMarkerProps> = ({
  coordinates,
  avatarUrl,
  nickname,
  when,
}) => {
  return (
    <MapboxGL.MarkerView coordinate={coordinates} allowOverlap={true}>
      <View className="items-center">
        <Avatar imageUrl={avatarUrl} />
        <Text
          className="text-xs text-white mt-1"
          style={{fontFamily: "Roboto_500Medium"}}
        >
          {nickname}
        </Text>
        <TimeAgo
          date={when}
          className="text-xs text-slate-300"
          style={{fontFamily: "Roboto_400Regular"}}
        />
      </View>
    </MapboxGL.MarkerView>
  );
};

export default IndividualMarker;
