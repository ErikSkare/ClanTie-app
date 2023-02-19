import {View, ViewProps} from "react-native";

interface ViewedBarProps extends ViewProps {
  length: number;
  viewed: number;
}

const ViewedBar: React.FC<ViewedBarProps> = ({
  length,
  viewed,
  className = "",
  ...props
}) => {
  return (
    <View className={`flex-row gap-2 ${className}`} {...props}>
      {Array.from(Array(length).keys()).map((value, key) => (
        <View
          key={key}
          className={`h-1 flex-1 rounded ${
            value <= viewed ? "bg-slate-200" : "bg-slate-600"
          }`}
        />
      ))}
    </View>
  );
};

export default ViewedBar;
