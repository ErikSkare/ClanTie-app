import {View, ViewProps} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Header from "./Header";

const MainLayout: React.FC<ViewProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <SafeAreaView className="flex-1 bg-slate-700">
      <View
        className={`flex-1 bg-slate-700 height-screen ${className}`}
        {...props}
      >
        <Header />
        {children}
      </View>
    </SafeAreaView>
  );
};

export default MainLayout;
