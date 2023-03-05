import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import jwtDecode, {JwtPayload} from "jwt-decode";
import useTokenStore from "../stores/useTokenStore";

function shouldTryToRefresh(accessToken: string | null, interval: number) {
  if (!accessToken) return true;

  const decodedAccess = jwtDecode<JwtPayload>(accessToken);

  return (
    decodedAccess &&
    (decodedAccess.exp as number) - interval <= Date.now() / 1000
  );
}

export default () => {
  const authenticate = useTokenStore((state) => state.authenticate);
  const logout = useTokenStore((state) => state.logout);

  async function tryRefresh() {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    if (!shouldTryToRefresh(accessToken, 10))
      return authenticate(accessToken ?? "", refreshToken ?? "");

    if (!refreshToken) return logout();

    const refreshResponse = await fetch(
      `https://${Constants.manifest?.extra?.apiUrl}/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({refreshToken}),
      }
    );

    if (!refreshResponse.ok) return logout();

    const {accessToken: newAccess, refreshToken: newRefresh} =
      (await refreshResponse.json()) as {
        accessToken: string;
        refreshToken: string;
      };

    return authenticate(newAccess, newRefresh);
  }

  return tryRefresh;
};
