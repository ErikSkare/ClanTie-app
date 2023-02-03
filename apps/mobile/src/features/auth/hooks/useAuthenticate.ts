import useTokenStore from "../stores/useTokenStore";

export default function useAuthenticate() {
  const isLoading = useTokenStore((state) => state.isLoading);

  const isAuthed = useTokenStore(
    (state) => state.accessToken !== "" && state.refreshToken !== ""
  );

  const load = useTokenStore((state) => state.load);

  if (isLoading) load();

  return {isAuthed, isLoading};
}
