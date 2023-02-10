import useTokenStore from "../stores/useTokenStore";

export default function useAuthenticate() {
  const isLoading = useTokenStore((state) => state.isLoading);

  const isAuthed = useTokenStore(
    (state) => state.accessToken !== "" && state.refreshToken !== ""
  );

  return {isAuthed, isLoading};
}
