import { sum } from "@ftdr/react-native-boilerplate";
import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>{sum(1, 2, 3, 4)}</Text>
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
