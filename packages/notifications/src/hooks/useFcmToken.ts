import messaging from "@react-native-firebase/messaging";
import { useState, useEffect } from "react";

export const useFcmToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    messaging().getToken().then(setToken).catch(setError);
  }, []);

  return [token, error] as const;
};
