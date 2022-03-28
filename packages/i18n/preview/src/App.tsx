import {
  LocalizationStateProvider,
  prepareI18nAssets,
} from "@ftdr/react-native-i18n";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { assets } from "./assets";
import { BasicScreen, LoadResourcesScreen } from "./screens";

const i18nAssets = prepareI18nAssets([
  assets.languages.en,
  assets.languages.es,
  assets.languages.pl,
]);

const App = () => {
  return (
    <LocalizationStateProvider localizationResource={i18nAssets}>
      <SafeAreaView style={styles.container}>
        <BasicScreen />
        <LoadResourcesScreen />
      </SafeAreaView>
    </LocalizationStateProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
