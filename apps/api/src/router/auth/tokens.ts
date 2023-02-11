import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRATION = "5m";
const REFRESH_TOKEN_EXPIRATION = "1d";

interface UserIdPayload extends jwt.JwtPayload {
  userId: number;
}

export default Object.freeze({
  generate(userId: number) {
    const accessToken = jwt.sign(
      {userId} as UserIdPayload,
      process.env.ACCESS_SECRET as string,
      {
        expiresIn: ACCESS_TOKEN_EXPIRATION,
      }
    );
    const refreshToken = jwt.sign(
      {userId} as UserIdPayload,
      process.env.REFRESH_SECRET as string,
      {
        expiresIn: REFRESH_TOKEN_EXPIRATION,
      }
    );
    return {
      accessToken,
      refreshToken,
    };
  },

  getUserId(token: string | undefined, secret: string) {
    if (!token) return undefined;
    try {
      const {userId} = <UserIdPayload>jwt.verify(token, secret);
      return userId;
    } catch {
      return undefined;
    }
  },

  getAccessExpirationInMs() {
    // 1 minute
    return 1000 * 15;
  },
});
