import {View, ViewProps} from "react-native";
import Header from "./Header";

const MainLayout: React.FC<ViewProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <View
      className={`flex-1 bg-slate-700 height-screen ${className}`}
      {...props}
    >
      <Header />
      {children}
    </View>
  );
};

export default MainLayout;
