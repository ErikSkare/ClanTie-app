import {Text, View} from "react-native";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {ClanTabParamList} from "@/navigation/ClanTab";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import Memories from "../components/Memories";

export type AlbumScreenProps = BottomTabScreenProps<ClanTabParamList, "Album">;

const AlbumScreen: React.FC<AlbumScreenProps> = ({navigation, route}) => {
  return (
    <EmptyLayout
      backgroundClassName="bg-slate-800"
      withSlideBackButton={true}
      goBack={() => navigation.getParent()?.goBack()}
    >
      <View className="flex-1 mt-12 p-4">
        <Text
          className="text-white text-2xl mb-8"
          style={{fontFamily: "Roboto_700Bold"}}
        >
          Emlékek
        </Text>
        <Memories clanId={route.params.clanId} className="flex-1" />
      </View>
    </EmptyLayout>
  );
};

export default AlbumScreen;
