import {useState} from "react";
import Constants from "expo-constants";
import {createTRPCReact} from "@trpc/react-query";
import {httpLink} from "@trpc/client";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import type {AppRouter} from "@clantie/api";
import jwtDecode, {JwtPayload} from "jwt-decode";
import useTokenStore from "@/features/auth/stores/useTokenStore";
import superjson from "superjson";
import Toast from "react-native-toast-message";

export const trpc = createTRPCReact<AppRouter>();

async function useRefreshToken() {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  if (!refreshToken) return null;

  const refreshResponse = await fetch(
    `http://${Constants.manifest?.extra?.apiUrl}/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({refreshToken}),
    }
  );

  if (!refreshResponse.ok) return null;

  return (await refreshResponse.json()) as {
    accessToken: string;
    refreshToken: string;
  };
}

export const TRPCProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const logout = useTokenStore((state) => state.logout);
  const authenticate = useTokenStore((state) => state.authenticate);

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
            let accessToken = await SecureStore.getItemAsync("accessToken");

            if (accessToken) {
              const decodedAccess = jwtDecode<JwtPayload>(accessToken);

              const shouldRefresh =
                decodedAccess &&
                (decodedAccess.exp as number) - 10 <= Date.now() / 1000;

              if (shouldRefresh) {
                const result = await useRefreshToken();
                if (!result) await logout();
                else {
                  accessToken = result.accessToken;
                  await authenticate(result.accessToken, result.refreshToken);
                }
              }
            }

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
