import Tokens from "../tokens";

export default function AccessUseCase(accessToken: string | undefined) {
  if (!accessToken) return undefined;

  const userId = Tokens.getUserId(
    accessToken as string,
    process.env.ACCESS_SECRET as string
  );

  return userId;
}
