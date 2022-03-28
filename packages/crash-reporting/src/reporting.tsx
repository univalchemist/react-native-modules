import React from "react";
import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps,
} from "react-error-boundary";
import { Text, View } from "react-native";
import { CrashReporting } from ".";

function DefaultErrorPlaceholder() {
  return (
    <View>
      <Text>Something went wrong</Text>
    </View>
  );
}

const onErrorBoundary = (error: Error, info: { componentStack: string }) => {
  if (__DEV__) {
    console.log("DefaultOnErrorBoundary handler:", error, info.componentStack);
  }
  CrashReporting.recordError(error, info.componentStack);
};

interface ErrorBoundaryProps {
  FallbackComponent?: React.ComponentType<FallbackProps>;
  onError?: any;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  FallbackComponent = DefaultErrorPlaceholder,
  onError = onErrorBoundary,
}) => {
  return (
    <ReactErrorBoundary FallbackComponent={FallbackComponent} onError={onError}>
      {children}
    </ReactErrorBoundary>
  );
};
