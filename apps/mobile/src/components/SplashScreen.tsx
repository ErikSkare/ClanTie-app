import {StatusBar} from "expo-status-bar";
import {ActivityIndicator, View} from "react-native";

const SplashScreen = () => {
  return (
    <View className="flex items-center justify-center bg-slate-700 h-screen">
      <ActivityIndicator color="white" size="large" />
      <StatusBar backgroundColor="#1E293B" translucent={false} />
    </View>
  );
};

export default SplashScreen;
