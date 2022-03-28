import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { AsyncStorageKey } from "..";

enum EResult {
  CANCELLED = "CANCELLED",
  DISABLED = "DISABLED",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export const useBiometry = () => {
  const [facialRecognitionAvailable, setFacialRecognitionAvailable] = useState(
    false
  );
  const [fingerprintAvailable, setFingerprintAvailable] = useState(false);
  const [irisAvailable, setIrisAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EResult | null>();

  useEffect(() => {
    const checkSupportedAuthentication = async () => {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

      const { AuthenticationType } = LocalAuthentication;

      if (types.length) {
        setFacialRecognitionAvailable(
          types.includes(AuthenticationType.FACIAL_RECOGNITION)
        );

        setFingerprintAvailable(types.includes(AuthenticationType.FINGERPRINT));

        setIrisAvailable(types.includes(AuthenticationType.IRIS));
      }
    };

    checkSupportedAuthentication();
  }, []);

  const authenticate = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    let status;

    setResult(null);

    try {
      const results = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: true,
        cancelLabel: "Cancel",
      });

      if (results.success) {
        setResult(EResult.SUCCESS);
        status = EResult.SUCCESS;
      } else if (results.error === "unknown") {
        setResult(EResult.DISABLED);
        status = EResult.DISABLED;
      } else if (
        ["user_cancel", "system_cancel", "app_cancel"].includes(results.error)
      ) {
        setResult(EResult.CANCELLED);
        status = EResult.CANCELLED;
      }
    } catch (err) {
      setResult(EResult.ERROR);
      status = EResult.ERROR;
    }

    setLoading(false);

    return status;
  }, [loading]);

  const [isEnrolledDevice, setIsEnrolledDevice] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const checkIsEnrolledDevice = async () => {
      setIsEnrolledDevice(await LocalAuthentication.isEnrolledAsync());
    };

    checkIsEnrolledDevice();
  }, []);

  const [isBiometryEnabled, setIsBiometryEnabled] = useState<boolean | null>(
    null
  );

  const setBiometryStatus = useCallback(
    async (status: boolean) => {
      if (!status || (status && (await authenticate()) === "SUCCESS")) {
        await AsyncStorage.setItem(
          AsyncStorageKey.BiometryEnabled,
          status.toString()
        );

        setIsBiometryEnabled(status);
      }
    },
    [authenticate]
  );

  useEffect(() => {
    const hydrateBiometry = async () => {
      const biometryStatus = await AsyncStorage.getItem(
        AsyncStorageKey.BiometryEnabled
      );

      setIsBiometryEnabled(
        biometryStatus ? !!JSON.parse(biometryStatus) : false
      );
    };

    hydrateBiometry();
  }, []);

  return {
    isBiometryEnabled,
    setBiometryStatus,
    facialRecognitionAvailable,
    fingerprintAvailable,
    irisAvailable,
    isEnrolledDevice,
    authenticate,
    result,
  };
};
