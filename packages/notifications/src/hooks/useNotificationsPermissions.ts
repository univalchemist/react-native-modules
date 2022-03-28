import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { useCallback, useEffect, useState } from "react";

interface Params {
  enabled?: boolean;
}

const initialParams = {
  enabled: true,
};

export const useNotificationsPermissions = ({
  enabled,
}: Params = initialParams) => {
  const [
    permission,
    setPermission,
  ] = useState<FirebaseMessagingTypes.AuthorizationStatus>();
  const [granted, setGranted] = useState<boolean | null>(null);

  const requestPermission = useCallback(async () => {
    const authStatus = await messaging().requestPermission();

    const { AUTHORIZED, PROVISIONAL } = messaging.AuthorizationStatus;

    const permissionGranted = [AUTHORIZED, PROVISIONAL].includes(authStatus);

    setPermission(authStatus);
    setGranted(permissionGranted);
  }, []);

  useEffect(() => {
    if (enabled) {
      requestPermission();
    }
  }, [enabled, requestPermission]);

  return {
    granted,
    permission,
    requestPermission,
  };
};
