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
      authenticate: async (accessToken: string, refreshToken: string) => {
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
        set({accessToken, refreshToken, isLoading: false});
      },
      logout: async () => {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        set({accessToken: "", refreshToken: "", isLoading: false});
      },
    })
  )
);

export default useTokenStore;
