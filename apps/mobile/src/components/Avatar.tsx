import React from "react";
import {ViewProps, View} from "react-native";
import RefetchImage from "./RefetchImage";

interface AvatarProps extends ViewProps {
  imageUrl: string;
  size?: "small" | "big";
  isActive?: boolean;
  outlined?: boolean;
  outlineType?: "gold" | "gray";
}

const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  size = "small",
  isActive = false,
  outlined = false,
  outlineType = "gold",
  className = "",
  ...props
}) => {
  const sizeClassName = size == "small" ? "w-10" : "w-14";
  const activeSizeClassName = size == "small" ? "w-[12px]" : "w-[14px]";

  return (
    <View {...props}>
      <View
        className={`bg-slate-600 relative rounded-full aspect-square ${
          outlined &&
          `border-[3px] ${
            outlineType === "gold" ? "border-yellow-400" : "border-gray-500"
          }`
        } ${sizeClassName} ${className}`}
      >
        <RefetchImage
          source={{uri: imageUrl}}
          className="w-full h-full rounded-full"
          refetchCount={4}
          refetchDelay={250}
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
