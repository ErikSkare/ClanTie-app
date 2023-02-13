import {View} from "react-native";
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
      goBack={() => navigation.goBack()}
    >
      <View className="flex-1 mt-16 p-4">
        <ClanInfo clanId={route.params.clanId} />
      </View>
    </EmptyLayout>
  );
};

export default LocationScreen;
