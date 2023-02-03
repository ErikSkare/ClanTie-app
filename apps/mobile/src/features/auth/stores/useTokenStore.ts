import {create} from "zustand";
import {combine} from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

const useTokenStore = create(
  combine(
    {
      accessToken: "" as string,
      refreshToken: "" as string,
      isLoading: true as boolean,
    },
    (set) => ({
      load: async () => {
        const accessToken =
          (await SecureStore.getItemAsync("accessToken")) ?? "";
        const refreshToken =
          (await SecureStore.getItemAsync("refreshToken")) ?? "";
        set({accessToken, refreshToken, isLoading: false});
      },
      authenticate: async (accessToken: string, refreshToken: string) => {
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
        set({accessToken, refreshToken});
      },
      logout: () => set({accessToken: "", refreshToken: ""}),
    })
  )
);

export default useTokenStore;
