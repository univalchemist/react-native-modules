import React from "react";
import {
  StyleProp,
  Switch as BaseSwitch,
  SwitchProps,
  Text,
  View,
  ViewStyle,
} from "react-native";
import tw from "twrnc";

interface Props {
  label: string;
  on: boolean;
  onChange: SwitchProps["onValueChange"];
  style?: StyleProp<ViewStyle>;
}

export const Switch = ({ label, on, style, onChange }: Props) => {
  return (
    <View style={[tw`flex-row items-center`, style]}>
      <BaseSwitch value={on} onValueChange={onChange} />

      <Text style={tw`ml-3`}>{label}</Text>
    </View>
  );
};
