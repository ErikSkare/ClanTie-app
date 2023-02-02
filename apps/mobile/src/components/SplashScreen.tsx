import {ActivityIndicator, View} from "react-native";

const SplashScreen = () => {
  return (
    <View className="flex items-center justify-center bg-slate-700 h-screen">
      <ActivityIndicator color="white" size="large" />
    </View>
  );
};

export default SplashScreen;
