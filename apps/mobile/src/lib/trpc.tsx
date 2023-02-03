import {useState} from "react";
import Constants from "expo-constants";
import {createTRPCReact} from "@trpc/react-query";
import {httpLink} from "@trpc/client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import type {AppRouter} from "@clantie/api";
import useTokenStore from "@/features/auth/stores/useTokenStore";

export const trpc = createTRPCReact<AppRouter>();

export const TRPCProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const accessToken = useTokenStore((state) => state.accessToken);

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: Constants.manifest?.extra?.apiUrl,
          headers() {
            return {
              Authorization: `Bearer ${accessToken}`,
            };
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
