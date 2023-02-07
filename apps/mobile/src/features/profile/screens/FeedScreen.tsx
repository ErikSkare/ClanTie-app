import {MainStackParamList} from "@/navigation/MainStack";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {TouchableOpacity} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import MyClans from "@/features/clan/components/MyClans";
import MainLayout from "@/components/layouts/MainLayout";

export type FeedScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "Feed"
>;

const FeedScreen: React.FC<FeedScreenProps> = ({navigation}) => {
  return (
    <MainLayout className="flex justify-center items-center">
      <MyClans containerClassName="w-full flex-1" />
      <TouchableOpacity
        className="absolute bottom-4 right-4 bg-white rounded-full"
        onPress={() => navigation.navigate("CreateClan")}
      >
        <AntDesign name="pluscircle" size={56} color="#4ADE80" />
      </TouchableOpacity>
    </MainLayout>
  );
};

export default FeedScreen;
