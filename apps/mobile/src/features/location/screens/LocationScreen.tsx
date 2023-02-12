import {ActivityIndicator, View, Text} from "react-native";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {ClanTabParamList} from "@/navigation/ClanTab";
import {trpc} from "@/lib/trpc";
import EmptyLayout from "@/components/layouts/EmptyLayout";
import {Members} from "@/features/clan";

export type LocationScreenProps = BottomTabScreenProps<
  ClanTabParamList,
  "Location"
>;

const LocationScreen: React.FC<LocationScreenProps> = ({navigation, route}) => {
  const clanId = route.params.clanId;

  const {data, isLoading, isError} = trpc.clan.getById.useQuery({clanId});

  if (isError) {
    navigation.goBack();
    return null;
  }

  return (
    <EmptyLayout
      backgroundClassName="bg-slate-800"
      withSlideBackButton={true}
      goBack={() => navigation.goBack()}
    >
      <View className="flex-1 mt-16 p-4">
        {isLoading ? (
          <ActivityIndicator
            color="white"
            size="large"
            className="self-center"
          />
        ) : (
          <View>
            <Text
              className="text-white text-2xl mb-4"
              style={{fontFamily: "Roboto_700Bold"}}
            >
              {data.name}
            </Text>
            <Members data={data.members} avatarSize="big" />
          </View>
        )}
      </View>
    </EmptyLayout>
  );
};

export default LocationScreen;
