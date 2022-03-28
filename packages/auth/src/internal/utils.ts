import * as AuthSession from "expo-auth-session";
import { AuthConfig } from "./types";

export const fetchDiscovery = (issuer: AuthConfig["issuer"]) => {
  return AuthSession.fetchDiscoveryAsync(issuer);
};
