export default function RefreshUseCase(refreshToken: string | undefined): {
    accessToken: string;
    refreshToken: string;
} | undefined;
