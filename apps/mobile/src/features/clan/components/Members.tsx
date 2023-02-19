import {FlatList, TouchableOpacity} from "react-native";
import Avatar from "@/components/Avatar";

export type MemberData = {
  avatarUrl: string;
  user?: {
    isActive: boolean;
  };
  hasContent?: boolean;
  onPress?: () => void;
};

interface MembersProps {
  data: MemberData[];
  containerClassName?: string;
  avatarSize?: "big" | "small";
}

const Members: React.FC<MembersProps> = ({
  data,
  containerClassName = "",
  avatarSize,
}) => {
  return (
    <FlatList
      className={containerClassName}
      data={data.sort(
        (x, y) => Number(y.user?.isActive ?? 0) - Number(x.user?.isActive ?? 0)
      )}
      horizontal={true}
      renderItem={(info) => (
        <TouchableOpacity
          disabled={!info.item.hasContent}
          onPress={info.item.onPress}
        >
          <Avatar
            imageUrl={info.item.avatarUrl}
            className="px-2"
            size={avatarSize}
            isActive={info.item.user?.isActive ?? false}
            outlined={info.item.hasContent}
          />
        </TouchableOpacity>
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Members;
