import React, { FC, useMemo } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { useWalletContext } from "../../context/wallet-context/use-wallet-context";
import { ACHAccount as ACHAccountModel } from "../../models";
import { SavedPaymentItemPassthroughProps } from "../saved-payment-item";

export interface ACHAccountProps extends SavedPaymentItemPassthroughProps {
  data: ACHAccountModel;
}

const getInnerText = (account_number: string) => {
  const last_4 = account_number.slice(-4);

  return `
    ACH account ending in ${last_4}
  `;
};

export const ACHAccount: FC<ACHAccountProps> = ({
  index,
  data,
  isDefault,
  // activeMethod, // TODO handle activeMethod
  setActiveCallback,
  onSetDefaultRequested,
  onDeleteRequested,
}) => {
  const { deleteDefault, displayDelete, displaySetDefault, displayRadio } =
    useWalletContext();

  const innerText: string = useMemo<string>(() => {
    return getInnerText(data.details.account_number);
  }, [data.details.account_number]);

  const isDefaultText = useMemo<JSX.Element>(() => {
    return (
      <Text
        style={tw`text-gray mx-2`}
        data-testid={`Saved__Payment__Default__ACH__${index}`}
      >
        Default
      </Text>
    );
  }, [index]);

  const makeDefaultButton = useMemo<JSX.Element>(() => {
    return (
      <Button
        title="Make default"
        data-testid={`Saved__Payment__Make__Default__Action__ACH__${index}`}
        onPress={() => onSetDefaultRequested?.(data)}
        color="secondary"
      />
    );
  }, [onSetDefaultRequested, data, index]);

  const deleteButton = useMemo<JSX.Element>(() => {
    return (
      <TouchableOpacity
        data-testid={`Saved__Payment__Remove__Action__ACH__${index}`}
        onPress={() => onDeleteRequested?.(data)}
        style={tw`mx-3 align-baseline`}
      >
        {/* TODO handle SVGs */}
        {/* <IconTrash /> */}
        <Text>(Trash)</Text>
      </TouchableOpacity>
    );
  }, [onDeleteRequested, data, index]);

  return (
    <View style={tw`border-solid border-1 border-gray-300 rounded-3 my-1`}>
      <View
        style={tw`flex justify-between shadow-raised px-6 py-6`}
        data-testid={`Saved__Payment__ACH__${index}`}
      >
        <View
          style={tw`w-12 flex justify-center`}
          data-testid={`Saved__Payment__ACH__Icon__${index}`}
        >
          {/* TODO handle SVGs */}
          {/* <IconCreditCard2 /> */}
          <Text>(Credit Card)</Text>
        </View>
        {displayRadio ? (
          <TouchableOpacity
            // TODO
            // color="interactive"
            // checked={activeMethod === data}
            onPress={() => setActiveCallback(data)}
            style={tw`mx-2`}
            data-testid={`Saved__Payment__Radio__ACH__${index}`}
          >
            <Text>{innerText}</Text>
          </TouchableOpacity>
        ) : (
          <View style={tw`flex items-center`}>
            <Text
              style={tw`mx-2`}
              data-testid={`Saved__Payment__Text__ACH__${index}`}
            >
              {innerText}
            </Text>
          </View>
        )}
        <View style={tw`ml-auto flex items-center flex-row`}>
          {isDefault ? isDefaultText : displaySetDefault && makeDefaultButton}
          {(!isDefault || deleteDefault) && displayDelete ? deleteButton : null}
        </View>
      </View>
    </View>
  );
};
