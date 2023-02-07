import Avatar from "@/components/Avatar";
import {View, ViewProps, Text, FlatList} from "react-native";

export type MemberData = {
  avatarUrl: string;
};

interface ClanCardProps extends ViewProps {
  clanName: string;
  members: MemberData[];
  containerClassName?: string;
}

const ClanCard: React.FC<ClanCardProps> = ({
  clanName,
  members,
  containerClassName = "",
  ...props
}) => {
  return (
    <View className={`p-4 bg-slate-800 ${containerClassName}`} {...props}>
      <Text
        className="text-lg text-white mb-4"
        style={{fontFamily: "Roboto_500Medium"}}
      >
        {clanName}
      </Text>
      <FlatList
        data={members}
        horizontal={true}
        renderItem={(info) => (
          <Avatar imageUrl={info.item.avatarUrl} className="pr-4" />
        )}
      />
    </View>
  );
};

export default ClanCard;
