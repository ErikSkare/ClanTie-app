import {StatusBar} from "expo-status-bar";
import {ActivityIndicator} from "react-native";
import EmptyLayout from "./layouts/EmptyLayout";

const SplashScreen = () => {
  return (
    <EmptyLayout className="flex justify-center items-center">
      <ActivityIndicator color="white" size="large" />
      <StatusBar backgroundColor="#1E293B" translucent={false} />
    </EmptyLayout>
  );
};

export default SplashScreen;
