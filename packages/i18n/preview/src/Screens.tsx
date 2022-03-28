import { LocalizationStateContext } from "@ftdr/react-native-i18n";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { A250 } from "./assets";
import { LanguageSelector } from "./components";
import { ImageLocalized, useLocalizedImage } from "./hooks/useLocalizedImage";

export const BasicScreen = () => {
  const { resolveToLocalizedImage } = useLocalizedImage();
  const { t } = useTranslation(["basic"]);

  return (
    <View style={styles.container}>
      <Text>{t("basic:title")}</Text>
      <Text>{t("basic:description")}</Text>
      <View style={styles.imageWrapper}>
        <ImageLocalized source={A250} style={styles.image} />
        <Image source={resolveToLocalizedImage("A250")} style={styles.image} />
      </View>
    </View>
  );
};

export const LoadResourcesScreen = () => {
  const { t } = useTranslation(["basic"]);
  const { addResource } = useContext(LocalizationStateContext);

  const loadResources = async () => {
    addResource("es", "basic", "title", "Big Spanish title");
  };

  return (
    <View style={styles.container}>
      <Button
        title={t("basic:loadResourcesScreen:button")}
        onPress={() => {
          loadResources();
        }}
      />
      <LanguageSelector />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    flexDirection: "row",
  },
  image: {
    width: 125,
    height: 125,
    margin: 10,
  },
});
