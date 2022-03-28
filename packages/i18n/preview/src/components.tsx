import {
  AvailableLanguage,
  LocalizationStateContextValue,
  useLocalization,
} from "@ftdr/react-native-i18n";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const LanguageSelector = () => {
  const { t } = useTranslation(["basic"]);
  const [modalVisible, toggleModal] = useState(false);

  const { changeLanguage, language, availableLanguages } = useLocalization();

  return (
    <View style={styles.container}>
      <Button
        title={t("basic:languageSelector:button")}
        onPress={() => {
          toggleModal((prevState) => !prevState);
        }}
      />

      <LanguageSelectorModal
        modalVisible={modalVisible}
        availableLanguages={availableLanguages}
        language={language}
        changeLanguage={changeLanguage}
        toggleModal={toggleModal}
      />
    </View>
  );
};

type LanguageSelectorModalProps = Pick<
  LocalizationStateContextValue,
  "changeLanguage" | "availableLanguages" | "language"
> & {
  modalVisible: boolean;
  toggleModal: Dispatch<SetStateAction<boolean>>;
};
const LanguageSelectorModal = ({
  modalVisible,
  availableLanguages,
  changeLanguage,
  toggleModal,
  language,
}: LanguageSelectorModalProps) => {
  const { t } = useTranslation(["basic"]);

  return (
    <Modal animationType="slide" visible={modalVisible} transparent>
      <View style={styles.modalContainer}>
        {availableLanguages?.map((item: AvailableLanguage, idx: number) => (
          <LanguageElement
            key={idx}
            title={`${item.title}`}
            onPress={() => {
              changeLanguage(item.lng);
            }}
            selected={item.lng === language}
          />
        )) ?? <Text>{t("basic:languageSelectorModal:emptyList")}</Text>}

        <View>
          <Button
            title={t("basic:languageSelectorModal:close")}
            onPress={() => {
              toggleModal((prevState) => !prevState);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

type LanguageElementProps = {
  title: string;
  onPress: () => void;
  selected: boolean;
};
const LanguageElement = ({
  title,
  onPress,
  selected,
}: LanguageElementProps) => {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.languageElement}>
        <Text>
          {selected ? "x" : ""} {title}
        </Text>
      </TouchableOpacity>
    );
  }
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    flexDirection: "column",
    justifyContent: "center",
  },
  modalContainer: {
    position: "absolute",
    margin: 60,
    top: "30%",
    width: "70%",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
  },
  languageElement: {
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
