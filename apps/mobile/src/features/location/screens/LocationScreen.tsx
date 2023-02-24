import {View} from "react-native";
import Map from "../components/Map";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {ClanTabParamList} from "@/navigation/ClanTab";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import ClanInfo from "@/features/clan/components/ClanInfo";

export type LocationScreenProps = BottomTabScreenProps<
  ClanTabParamList,
  "Location"
>;

const LocationScreen: React.FC<LocationScreenProps> = ({route, navigation}) => {
  return (
    <EmptyLayout
      backgroundClassName="bg-slate-800"
      withSlideBackButton={true}
      goBack={() => navigation.getParent()?.goBack()}
    >
      <View className="flex-1 mt-12 p-4">
        <ClanInfo clanId={route.params.clanId} />
        <Map
          className="w-full flex-1 mt-8"
          clanId={route.params.clanId}
          neBound={[16.078679371002213, 48.22330063143086]}
          swBound={[22.907196342292874, 45.900656997899745]}
          finalPadding={75}
        />
      </View>
    </EmptyLayout>
  );
};

export default LocationScreen;
