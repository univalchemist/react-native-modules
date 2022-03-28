import * as SecureStore from "expo-secure-store";
import { useEffect, useRef } from "react";

interface Params {
  authenticate: any;
  isBiometryEnabled: boolean | null;
  isEnrolledDevice: boolean | null;
  onSuccess: (accessToken: string) => void;
  onError: (err: Error) => void; // TODO add param
}

export const useBootstrap = ({
  authenticate,
  isBiometryEnabled,
  isEnrolledDevice,
  onSuccess,
  onError,
}: Params) => {
  const ready = useRef(false);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let accessToken;

      try {
        // TODO check if biometry is available
        // TODO check if biometry is enabled

        // console.log({ isBiometryAvailable, isBiometryEnabled });

        if (!isEnrolledDevice) {
          throw new Error();
        }

        // if (!isBiometryAvailable) {
        //   throw new Error();
        // }

        if (!isBiometryEnabled) {
          throw new Error();
        }

        accessToken = await SecureStore.getItemAsync("accessToken");

        if (!accessToken) {
          throw new Error();
        }

        // TODO refactor
        if (
          // !enableBiometry ||
          (await authenticate()) !== "SUCCESS"
        ) {
          // await SecureStore.deleteItemAsync('accessToken')

          throw new Error();
        }

        onSuccess(accessToken as string); // TODO update type
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onError();
        // Restoring token failed
      }
    };

    if (
      !ready.current &&
      isBiometryEnabled !== null &&
      // isBiometryAvailable !== null &&
      isEnrolledDevice !== null
    ) {
      ready.current = true;

      bootstrapAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isBiometryEnabled,
    //  isBiometryAvailable,
    isEnrolledDevice,
  ]);
};
