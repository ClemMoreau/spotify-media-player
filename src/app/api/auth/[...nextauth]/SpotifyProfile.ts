import axios from "axios";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";

if (!process.env.NEXT_PUBLIC_CLIENT_ID) {
    throw new Error("Missing env.NEXT_PUBLIC_CLIENT_ID");
}

if (!process.env.NEXT_PUBLIC_CLIENT_SECRET) {
    throw new Error("Missing env.NEXT_PUBLIC_CLIENT_SECRET");
}

const spotifyProfile = SpotifyProvider({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

const authUrl = new URL("https://accounts.spotify.com/authorize");

const SCOPES = [
    "streaming",
    "user-read-email",
    "user-top-read",
    "user-read-private",
    "user-library-read",
    "user-library-modify",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
];

authUrl.searchParams.append("scope", SCOPES.join(" "));

spotifyProfile.authorization = authUrl.toString();

export default spotifyProfile;

export const refreshAccessToken = async (token: JWT) => {
    try {
        const response = await axios.post(authUrl.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (!response) {
            throw response;
        }

        const refreshedTokens = response.data;
        return {
            ...token,
            access_token: refreshedTokens.access_token,
            token_type: refreshedTokens.token_type,
            expires_at: refreshedTokens.expires_at,
            expires_in: (refreshedTokens.expires_at ?? 0) - Date.now() / 1000,
            refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
            scope: refreshedTokens.scope,
        };
    } catch (error) {
        console.error(error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
};
