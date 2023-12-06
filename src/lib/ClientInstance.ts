"use client"

import { AuthUser } from "@/app/api/auth/[...nextauth]/authOptions";
import { 
    AccessToken, 
    IAuthStrategy, 
    SdkConfiguration, 
    SdkOptions, 
    SpotifyApi 
} from "@spotify/web-api-ts-sdk"
import { getSession, signIn } from "next-auth/react"

class NextAuthStrategy implements IAuthStrategy {
    public getOrCreateAccessToken(): Promise<AccessToken> {
        return this.getAccessToken()
    }
    public async getAccessToken(): Promise<AccessToken> {
        const session : any = await getSession();

        if (!session) {
            return {} as AccessToken;
        }

        if (session?.error === "RefreshAccessTokenError") {
            await signIn();
            return this.getAccessToken();
        }

        const { user }: {user: AuthUser} = session;

        return {
            access_token: user.access_token,
            expires_in: user.expires_in,
            expires: user.expires_at,
            refresh_token: user.refresh_token,
        } as AccessToken;
    }
    removeAccessToken(): void {
        this.removeAccessToken();
    }
    setConfiguration(configuration: SdkConfiguration): void {
        console.warn("[Spotify-SDK][WARN]\setConfiguration not implemented");
    }
}

const withNextAuthStrategy = (config?: SdkOptions) => {
    const strategy = new NextAuthStrategy();
    return new SpotifyApi(strategy, config);
}

export default withNextAuthStrategy();