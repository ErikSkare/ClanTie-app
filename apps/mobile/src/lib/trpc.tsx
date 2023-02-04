import {useState} from "react";
import Constants from "expo-constants";
import {createTRPCReact} from "@trpc/react-query";
import {httpLink} from "@trpc/client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import type {AppRouter} from "@clantie/api";
import jwtDecode, {JwtPayload} from "jwt-decode";
import useTokenStore from "@/features/auth/stores/useTokenStore";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

async function useRefreshToken() {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  if (!refreshToken) return null;

  const refreshResponse = await fetch(
    `${Constants.manifest?.extra?.apiUrl}/refresh`,
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

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpLink({
          url: `${Constants.manifest?.extra?.apiUrl}/trpc`,
          headers: async () => {
            const accessToken = await SecureStore.getItemAsync("accessToken");
            return {
              authorization: accessToken ? `Bearer ${accessToken}` : undefined,
            };
          },
          fetch: async (url, options) => {
            const accessToken = await SecureStore.getItemAsync("accessToken");

            if (accessToken) {
              const decodedAccess = jwtDecode<JwtPayload>(accessToken);

              const shouldRefresh =
                decodedAccess &&
                (decodedAccess.exp as number) - 10 <= Date.now() / 1000;

              if (shouldRefresh) {
                const result = await useRefreshToken();
                if (!result) await logout();
                else
                  await authenticate(result.accessToken, result.refreshToken);
              }
            }

            const response = await fetch(url, options);

            return response;
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
