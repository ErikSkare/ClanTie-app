import {FlatList} from "react-native";
import Avatar from "@/components/Avatar";

export type MemberData = {
  avatarUrl: string;
};

interface MembersProps {
  data: MemberData[];
  containerClassName?: string;
}

const Members: React.FC<MembersProps> = ({data, containerClassName = ""}) => {
  return (
    <FlatList
      className={containerClassName}
      data={data}
      horizontal={true}
      renderItem={(info) => (
        <Avatar imageUrl={info.item.avatarUrl} className="px-2" />
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Members;
