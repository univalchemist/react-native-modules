import React from "react";
import {
  TouchableOpacity,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Clipboard from "@react-native-community/clipboard";
import {
  useNotificationsPermissions,
  useFcmToken,
} from "@ftdr/react-native-notifications";

// TODO include useNotifications in example
const App = () => {
  useNotificationsPermissions();

  const [token] = useFcmToken();

  const copyToken = () => {
    Clipboard.setString(token);

    alert("Token copied to clipboard");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>FCM Token:</Text>

      <TouchableOpacity onPress={copyToken} style={styles.preview}>
        <Text>{token}</Text>
      </TouchableOpacity>

      <Button title="Copy token to clipboard" onPress={copyToken} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    justifyContent: "center",
  },
  label: {
    fontWeight: "700",
    fontSize: 16,
  },
  preview: {
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 2,
    padding: 12,
    borderRadius: 4,
    minHeight: 200,
  },
});

export default App;
