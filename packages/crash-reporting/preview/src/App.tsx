import {
  CrashReporting,
  ErrorBoundary,
} from "@ftdr/react-native-crash-reporting";
import React, { useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";

const App = () => {
  const [numbers, setNumbers] = useState(null);

  const [status, setStatus] = useState<boolean>(CrashReporting.getStatus());
  const toggleReporting = async () => {
    const currentStatus = CrashReporting.getStatus();
    if (currentStatus) {
      await CrashReporting.disable();
    } else {
      await CrashReporting.enable();
    }
    setStatus(!currentStatus);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Crash reporting</Text>
      <Button
        title="Raise a native error"
        onPress={() => {
          CrashReporting.raiseError();
        }}
      />
      <Button
        title="Raise a JS error"
        onPress={() => {
          setNumbers({});
        }}
      />
      <ErrorBoundary>
        <Text>{numbers}</Text>
      </ErrorBoundary>
      <View>
        <Button title="Toggle crash reporting" onPress={toggleReporting} />
        <Text>Current reporting status: {status ? "enabled" : "disabled"}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 40,
    fontWeight: "700",
    color: "#000",
  },
});

export default App;
