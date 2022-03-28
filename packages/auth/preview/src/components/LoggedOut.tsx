import { useAuth } from "@ftdr/react-native-auth";
import React, { useState } from "react";

import { StyleSheet, Text, TextInput, useColorScheme } from "react-native";
import { Button } from "../utils/Button";

export const LoggedOut = () => {
  const colorScheme = useColorScheme();

  const { login, loginError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
      login(email, password);
  };

  return (
    <>
      <Text
        style={[
          styles.title,
          {
            color: colorScheme === "dark" ? "#fff" : "#000",
          },
        ]}
      >
        Logged Out
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.nativeEvent.text)}
        style={styles.input}
        autoCapitalize='none'
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.nativeEvent.text)}
        style={styles.input}
        secureTextEntry
      />

      {loginError ? <Text>Unable to login</Text> : null}

      <Button onPress={() => handleLogin()}>Log In</Button>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 28,
  },
  input: {
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    borderRadius: 12,
    marginBottom: 12,
  }
});
