import {View, ViewProps, KeyboardAvoidingView, Platform} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Header from "./Header";

const MainLayout: React.FC<ViewProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-700"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView className="flex-1 bg-slate-700">
        <View
          className={`flex-1 bg-slate-700 height-screen ${className}`}
          {...props}
        >
          <Header />
          {children}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default MainLayout;
