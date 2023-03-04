declare const _default: Readonly<{
    generate(userId: number): {
        accessToken: string;
        refreshToken: string;
    };
    getUserId(token: string | undefined, secret: string): number | undefined;
    getAccessExpirationInMs(): number;
}>;
export default _default;
