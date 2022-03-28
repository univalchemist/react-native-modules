import { useAuth } from "@ftdr/react-native-auth";
import React from "react";
import { ActivityIndicator } from "react-native";
import { LoggedIn } from "./LoggedIn";
import { LoggedOut } from "./LoggedOut";

export const Content = () => {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return isLoggedIn ? <LoggedIn /> : <LoggedOut />;
};
