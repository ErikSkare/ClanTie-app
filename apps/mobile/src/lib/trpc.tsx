import {useState} from "react";
import Constants from "expo-constants";
import {createTRPCReact} from "@trpc/react-query";
import {httpLink} from "@trpc/client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import type {AppRouter} from "@clantie/api";

export const trpc = createTRPCReact<AppRouter>();

export const TRPCProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: Constants.manifest?.extra?.apiUrl,
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
