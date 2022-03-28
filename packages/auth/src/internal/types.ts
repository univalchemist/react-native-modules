export interface AuthConfig {
  issuer: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export type Issuer = AuthConfig["issuer"];
