import React from "react";
import {Image, ViewProps, View} from "react-native";

interface AvatarProps extends ViewProps {
  key?: number;
  imageUrl: string;
  size?: "small" | "big";
  isActive?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  key,
  imageUrl,
  size = "small",
  isActive = false,
  className = "",
  ...props
}) => {
  const sizeClassName = size == "small" ? "w-10" : "w-20";
  const activeSizeClassName = size == "small" ? "w-[14px]" : "w-[20px]";

  return (
    <View {...props}>
      <View
        className={`bg-slate-600 relative rounded-full aspect-square border-2 border-slate-500 ${sizeClassName} ${className}`}
      >
        <Image
          source={{uri: imageUrl}}
          key={key}
          className="w-full h-full rounded-full"
        />
        {isActive && (
          <View
            className={`absolute bottom-0 right-0 bg-green-400 rounded-full aspect-square border-2 border-slate-500 ${activeSizeClassName}`}
          />
        )}
      </View>
    </View>
  );
};

export default Avatar;
