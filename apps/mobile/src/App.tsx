import {useEffect} from "react";
import {ErrorBoundary} from "react-error-boundary";
import Toast from "react-native-toast-message";
import {QueryErrorResetBoundary} from "@tanstack/react-query";
import {TRPCProvider} from "@/lib/trpc";
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
import UnknownErrorScreen from "@/components/UnknownErrorScreen";
import {useRefreshToken} from "@/features/auth";

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

  const tryRefresh = useRefreshToken();

  useEffect(() => {
    tryRefresh();
  }, []);

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
