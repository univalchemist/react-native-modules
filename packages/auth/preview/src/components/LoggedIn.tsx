import { useAuth } from "@ftdr/react-native-auth";
import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, useColorScheme, View } from "react-native";
import { Button } from "../utils/Button";

export const LoggedIn = () => {
  const colorScheme = useColorScheme();

  const {
    logout,
    setBiometryStatus,
    isBiometryEnabled,
    isBiometryAvailable,
    result,
  } = useAuth();

  const [tempBiometryStatus, setTempBiometryStatus] = useState(null);

  useEffect(() => {
    if (result !== null) {
      setTempBiometryStatus(null);
    }
  }, [isBiometryEnabled, result]);

  return (
    <>
      <View style={styles.avatar}>
        <Text style={styles.initials}>JD</Text>
      </View>

      <Text
        style={[
          styles.profileName,
          { color: colorScheme === "dark" ? "#fff" : "#000" },
        ]}
      >
        John Doe
      </Text>
      <Text
        style={[
          styles.profileEmail,
          { color: colorScheme === "dark" ? "#aaa" : "#666" },
        ]}
      >
        john.doe@frontdoorhome.com
      </Text>

      <View
        style={[
          styles.option,
          { borderTopColor: colorScheme === "dark" ? "#666" : "#ddd" },
        ]}
      >
        <Text
          style={[
            styles.optionLabel,
            !isBiometryAvailable ? styles.optionLabelDisabled : {},
            { color: colorScheme === "dark" ? "#fff" : "#000" },
          ]}
        >
          Enable Biometrics
        </Text>

        <Switch
          trackColor={{ false: "#ddd", true: "#07b54d" }}
          onValueChange={(status) => {
            setTempBiometryStatus(status);
            setBiometryStatus(status);
          }}
          value={
            !isBiometryAvailable
              ? false
              : tempBiometryStatus || isBiometryEnabled
          }
          disabled={!isBiometryAvailable}
        />
      </View>

      {!isBiometryAvailable && (
        <Text
          style={{
            marginVertical: 8,
            color: "#f52020",
            fontWeight: "500",
          }}
        >
          Biometric login is not available
        </Text>
      )}

      <View style={styles.actionsWrapper}>
        <Button onPress={() => logout()}>Log Out</Button>
      </View>
    </>
  );
};

const AVATAR_SIZE = 96;

const styles = StyleSheet.create({
  avatar: {
    marginBottom: 20,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#07b54d",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "#fff",
    fontSize: 44,
  },
  profileName: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  profileEmail: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionLabel: {
    fontSize: 16,
    marginRight: 44,
  },
  optionLabelDisabled: {
    opacity: 0.25,
  },
  actionsWrapper: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
});
