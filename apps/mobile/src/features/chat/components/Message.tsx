import {memo} from "react";
import Avatar from "@/components/Avatar";
import RefetchImage from "@/components/RefetchImage";
import TimeAgo from "@/components/TimeAgo";
import {View, Text, ViewProps} from "react-native";

interface MessageProps extends ViewProps {
  content: string | null;
  images: {url: string}[];
  sentBy: {avatarUrl: string; nickname: string; user: {isActive: boolean}};
  createdAt: Date;
  wrapperClassName?: string;
}

const Message: React.FC<MessageProps> = ({
  sentBy,
  content,
  images,
  createdAt,
  wrapperClassName = "",
}) => {
  const imageUri = images[0]?.url;

  return (
    <View className={`flex-row ${wrapperClassName}`}>
      <Avatar
        size="small"
        imageUrl={sentBy.avatarUrl}
        isActive={sentBy.user.isActive}
      />
      <View className="ml-4 flex-1">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-slate-300 text-base"
            style={{fontFamily: "Roboto_500Medium"}}
          >
            {sentBy.nickname}
          </Text>
          <TimeAgo
            date={createdAt}
            className="text-slate-500"
            style={{fontFamily: "Roboto_400Regular"}}
          />
        </View>
        {imageUri && (
          <View className="w-full aspect-square mt-2 bg-slate-900">
            <RefetchImage
              source={{uri: imageUri}}
              className="w-full h-full"
              resizeMode="contain"
              refetchCount={4}
              refetchDelay={400}
            />
          </View>
        )}
        {content && (
          <Text
            className="text-white mt-2"
            style={{fontFamily: "Roboto_400Regular"}}
          >
            {content}
          </Text>
        )}
      </View>
    </View>
  );
};

export default memo(Message);
