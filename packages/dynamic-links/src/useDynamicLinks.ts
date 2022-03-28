import { useEffect } from "react";
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from "@react-native-firebase/dynamic-links";

type Link = FirebaseDynamicLinksTypes.DynamicLink | null;

interface Params {
  onLink?: (link: Link) => void;
  onForegroundLink?: (link: Link) => void;
  onBackgroundLink?: (link: Link) => void;
}

export const useDynamicLinks = ({
  onLink,
  onForegroundLink,
  onBackgroundLink,
}: Params) => {
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink((link: Link) => {
      onLink?.(link);
      onForegroundLink?.(link);
    });

    return () => unsubscribe();
  }, [onForegroundLink, onLink]);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link: Link) => {
        onLink?.(link);
        onBackgroundLink?.(link);
      });
  }, [onBackgroundLink, onLink]);
};
