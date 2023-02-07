import {View, ViewProps, Text} from "react-native";
import Members, {MemberData} from "./Members";

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
      <Members data={members} />
    </View>
  );
};

export default ClanCard;
