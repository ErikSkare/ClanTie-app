import type {AppRouter} from "@clantie/api";
import {useState} from "react";
import Toast from "react-native-toast-message";
import superjson from "superjson";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import {createTRPCReact} from "@trpc/react-query";
import {httpLink} from "@trpc/client";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import useRefreshToken from "@/features/auth/hooks/useRefreshToken";

export const trpc = createTRPCReact<AppRouter>();

export const TRPCProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const tryRefresh = useRefreshToken();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            useErrorBoundary: (error) =>
              // eslint-disable-next-line
              (error as any).data.code == "INTERNAL_SERVER_ERROR",
          },
        },
        mutationCache: new MutationCache({
          onError: (error) => {
            // eslint-disable-next-line
            if ((error as any).data.code == "INTERNAL_SERVER_ERROR")
              Toast.show({
                type: "error",
                text1: "Hiba történt",
                text2: "Nem sikerült végrehajtani a műveletet!",
              });
          },
        }),
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpLink({
          url: `http://${Constants.manifest?.extra?.apiUrl}/trpc`,
          fetch: async (url, options) => {
            await tryRefresh();

            const accessToken = await SecureStore.getItemAsync("accessToken");

            return fetch(url, {
              ...options,
              headers: {
                ...options?.headers,
                authorization: `Bearer ${accessToken}`,
              } as HeadersInit,
            });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
