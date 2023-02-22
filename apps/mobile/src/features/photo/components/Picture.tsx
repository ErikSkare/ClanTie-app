import {View, ViewProps, Image, Text} from "react-native";
import Avatar from "@/components/Avatar";
import TimeAgo from "@/components/TimeAgo";

interface PictureProps extends ViewProps {
  imageUrl: string;
  avatarUrl: string;
  nickname: string;
  createdAt: Date;
}

const Picture: React.FC<PictureProps> = ({
  imageUrl,
  avatarUrl,
  nickname,
  createdAt,
  ...props
}) => {
  return (
    <View {...props}>
      <Image
        source={{uri: imageUrl}}
        className="w-full h-full"
        resizeMode="contain"
      />
      <View className="absolute bottom-4 px-4 z-10 w-full flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <Avatar imageUrl={avatarUrl} size="big" />
          <Text
            className="text-white text-lg"
            style={{fontFamily: "Roboto_500Medium"}}
          >
            {nickname}
          </Text>
        </View>
        <TimeAgo
          date={createdAt}
          className="text-slate-400"
          style={{fontFamily: "Roboto_400Regular"}}
        />
      </View>
    </View>
  );
};

export default Picture;
