import {TouchableOpacity, View, ViewProps} from "react-native";
import {AntDesign} from "@expo/vector-icons";

interface EmptyLayoutProps extends ViewProps {
  withCloseButton?: boolean;
  withSlideBackButton?: boolean;
  goBack?: () => void;
  backgroundClassName?: string;
}

const EmptyLayout: React.FC<EmptyLayoutProps> = ({
  withCloseButton = false,
  withSlideBackButton = false,
  goBack = () => undefined,
  backgroundClassName = "bg-slate-700",
  children,
  className = "",
  ...props
}) => {
  return (
    <View
      className={`flex-1 height-screen ${backgroundClassName} ${className}`}
      {...props}
    >
      {withCloseButton && (
        <TouchableOpacity
          className="absolute top-4 left-4 z-10"
          onPress={goBack}
        >
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>
      )}
      {withSlideBackButton && (
        <TouchableOpacity
          className="absolute top-4 left-4 z-10"
          onPress={goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      )}
      {children}
    </View>
  );
};

export default EmptyLayout;
