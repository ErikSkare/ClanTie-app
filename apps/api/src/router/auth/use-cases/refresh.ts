import Tokens from "../tokens";

export default function RefreshUseCase(refreshToken: string | undefined) {
  if (!refreshToken) return undefined;

  const userId = Tokens.getUserId(
    refreshToken,
    process.env.REFRESH_SECRET as string
  );

  if (!userId) return undefined;
  return Tokens.generate(userId);
}
