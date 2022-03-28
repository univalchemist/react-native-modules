import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";
import { useAppContext } from "../../hooks/use-app-context";

export const WalletEmptyView: React.FC = () => {
  const {
    appSettings: { localizedText },
  } = useAppContext();

  return (
    <View
      style={tw`
          border-solid border-1 border-gray-300 
          rounded-3 my-1 text-center p-4
        `}
    >
      <Text style={tw`text-gray m-2 p-2`}>
        {localizedText("NO_PAYMENT_METHOD")}
      </Text>
    </View>
  );
};
