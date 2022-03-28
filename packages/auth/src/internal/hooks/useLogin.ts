// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";
import { AuthConfig } from "../types";
import { SecureStorageKey } from "../constants";
// import { fetchDiscovery } from "../utils";

// interface FetchCreditsParams {
//   code: string;
//   request: AuthSession.AuthRequest;
//   tokenEndpoint: AuthSession.DiscoveryDocument["tokenEndpoint"];
// }

interface Params {
  issuer: AuthConfig["issuer"];
  config: Omit<AuthConfig, "issuer">;
  onSuccess: (accessToken: string) => void;
  onError: (err: Error) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useLogin = ({ issuer, config, onSuccess, onError }: Params) => {
  return useCallback(
    async (loginId: string, password: string) => {
      try {
        const response = await fetch('https://frontdoorhome-dev.fusionauth.io/api/login', {
          method: "POST",
          headers: {
            "X-FusionAuth-TenantId": "0d6adc4d-af5d-41b6-9c5b-4df915fd0da9",
            "Content-Type": "application/json",
            "Cookie": "fusionauth.locale=en; fusionauth.sso=AgKWJZvmoX4IZx-_9jIo-jIuaqtbB_iZE_fvdv58oyjr",
          },
          body: JSON.stringify({
            loginId,
            password,
            "applicationId": "64a99950-dfb9-4f03-9100-1c23a106ddb6"
          })
        });

        if (!response.ok) {
          throw new Error();
        }

        const credits = await response.json();

        const token = credits?.token;

        if (!token) {
          throw new Error("Unable to fetch access token");
        }

        await SecureStore.setItemAsync(SecureStorageKey.AccessToken, token);

        // TODO set refresh token
        // if (credits.refreshToken) {
        //   await SecureStore.setItemAsync(SecureStorageKey.RefreshToken, credits.refreshToken);
        // }

        onSuccess(token); // TODO? return refresh token
      } catch (err) {
        onError()
      }
    },
    [onError, onSuccess]
  );
};
