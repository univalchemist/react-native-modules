import { AuthProvider } from "@ftdr/react-native-auth";
import React from "react";
import { SafeAreaView, StyleSheet, useColorScheme, View } from "react-native";
import {
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_ISSUER_URI,
  AUTH_REDIRECT_URI,
} from "react-native-dotenv";
import { Content } from "./components/Content";

const config = {
  issuer: AUTH_ISSUER_URI,
  clientId: AUTH_CLIENT_ID,
  clientSecret: AUTH_CLIENT_SECRET,
  redirectUri: AUTH_REDIRECT_URI,
};

const App = () => {
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? "#1d1e24" : "#fff",
      }}
    >
      <AuthProvider config={config}>
        <SafeAreaView style={styles.container}>
          <Content />
        </SafeAreaView>
      </AuthProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 32,
    flex: 1,
  },
});

export default App;
