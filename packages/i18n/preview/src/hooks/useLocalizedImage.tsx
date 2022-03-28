import { useLocalization } from "@ftdr/react-native-i18n";
import React from "react";
import { Image, ImageProps } from "react-native";
import { assets, LocalizedImage } from "../assets";

const DEFAULT_LANGUAGE = "en";

export const useLocalizedImage = () => {
  const { language } = useLocalization();

  const resolveToLocalizedImage = (imageName: string) => {
    if (!assets.images[imageName]) {
      throw Error(
        "useLocalizedImage, resolveLocaleToImage - Cannot find image for the given imageName"
      );
    }

    if (!assets.images[imageName]?.[language]) {
      console.warn(
        "useLocalizedImage, resolveLocaleToImage - Cannot find image for the given locale"
      );
      return assets.images[imageName][DEFAULT_LANGUAGE];
    }

    return assets.images[imageName][language];
  };

  return {
    resolveToLocalizedImage,
  };
};

export const ImageLocalized = (
  props: Omit<ImageProps, "source"> & { source: LocalizedImage }
) => {
  const { language } = useLocalization();
  const { source: rawSource, ...restProps } = props;

  let source = rawSource[language];
  if (!source) {
    source = rawSource[DEFAULT_LANGUAGE];
  }

  return <Image {...restProps} source={source} />;
};
