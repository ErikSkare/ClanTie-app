import {ErrorBoundary} from "react-error-boundary";
import {TRPCProvider} from "@/lib/trpc";
import {QueryErrorResetBoundary} from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import TimeAgo from "javascript-time-ago";
import hu from "javascript-time-ago/locale/hu";
import {
  useFonts,
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from "@expo-google-fonts/roboto";
import SplashScreen from "@/components/SplashScreen";
import Navigator from "@/navigation/Navigator";
import UnknownErrorScreen from "./components/UnknownErrorScreen";

TimeAgo.addDefaultLocale(hu);

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  });

  if (!fontsLoaded) return <SplashScreen />;

  return (
    <TRPCProvider>
      <QueryErrorResetBoundary>
        {({reset}) => (
          <ErrorBoundary onReset={reset} FallbackComponent={UnknownErrorScreen}>
            <Navigator />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
      <Toast />
    </TRPCProvider>
  );
}
