import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { useEffect } from "react";

interface Params {
  onMessage?: (message: FirebaseMessagingTypes.RemoteMessage) => void;
  onForegroundMessage?: (message: FirebaseMessagingTypes.RemoteMessage) => void;
  onBackgroundMessage?: (message: FirebaseMessagingTypes.RemoteMessage) => void;
}

export const useNotifications = ({
  onMessage,
  onForegroundMessage,
  onBackgroundMessage,
}: Params) => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      onMessage?.(remoteMessage);
      onForegroundMessage?.(remoteMessage);
    });

    return unsubscribe;
  }, [onForegroundMessage, onMessage]);

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      onMessage?.(remoteMessage);
      onBackgroundMessage?.(remoteMessage);
    });
  }, [onBackgroundMessage, onMessage]);
};
