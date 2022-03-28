import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";
import { Issuer } from "../types";
import { SecureStorageKey } from "../constants";
import { fetchDiscovery } from "../utils";

interface Params {
  issuer: Issuer;
  onSuccess: () => void;
  onError: (err: Error) => void;
}

export const useLogout = ({ issuer, onSuccess, onError }: Params) => {
  return useCallback(async () => {
    try {
      // TODO handle revoke token
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const discovery = await fetchDiscovery(issuer);

      console.log(discovery);

      await SecureStore.deleteItemAsync(SecureStorageKey.AccessToken);

      // TODO remove refresh token
      // await SecureStore.deleteItemAsync(SecureStorageKey.RefreshToken);

      onSuccess();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onError(err);
    }
  }, [issuer, onError, onSuccess]);
};
