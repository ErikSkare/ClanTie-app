import {View} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {ClanTabParamList} from "@/navigation/ClanTab";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import ClanInfo from "@/features/clan/components/ClanInfo";

export type LocationScreenProps = BottomTabScreenProps<
  ClanTabParamList,
  "Location"
>;

const NE_BOUND = [16.078679371002213, 48.22330063143086];
const SW_BOUND = [22.907196342292874, 45.900656997899745];

const LocationScreen: React.FC<LocationScreenProps> = ({route, navigation}) => {
  return (
    <EmptyLayout
      backgroundClassName="bg-slate-800"
      withSlideBackButton={true}
      goBack={() => navigation.goBack()}
    >
      <View className="flex-1 mt-12 p-4">
        <ClanInfo clanId={route.params.clanId} />
        <MapboxGL.MapView
          className="w-full flex-1 mt-8"
          styleURL="mapbox://styles/skareerik011/cled1mnss003e01pc07h42m8k"
          localizeLabels={true}
          scaleBarEnabled={false}
          rotateEnabled={false}
          attributionPosition={{bottom: 4, right: 4}}
        >
          <MapboxGL.Camera
            bounds={{
              ne: NE_BOUND,
              sw: SW_BOUND,
            }}
            animationMode="none"
          />
        </MapboxGL.MapView>
      </View>
    </EmptyLayout>
  );
};

export default LocationScreen;
