import React, { FC, useMemo } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { useWalletContext } from "../../context/wallet-context/use-wallet-context";
import {
  CreditCard as CreditCardModel,
  CreditCardBrands,
  ExpirationDate,
} from "../../models";
import { SavedPaymentItemPassthroughProps } from "../saved-payment-item";

export interface CreditCardProps extends SavedPaymentItemPassthroughProps {
  data: CreditCardModel;
}

//this defaults to not being expired since we wouldn't want to
//limit cards we don't understand; that should be a job for the
//backend
const isExpired = (expires: ExpirationDate): boolean => {
  const currentDate = new Date();
  return (
    expires.year < currentDate.getFullYear() ||
    (expires.year == currentDate.getFullYear() &&
      expires.month < currentDate.getMonth() + 1)
  );
};

const getIconFromBrand = (brand: CreditCardBrands): JSX.Element => {
  switch (brand) {
    case CreditCardBrands.Visa:
      // TODO handle SVGs
      // return <IconVisa />;
      return <Text>(Visa)</Text>;
    case CreditCardBrands.MasterCard:
      // TODO handle SVGs
      // return <IconMastercard />;
      return <Text>(MasterCard)</Text>;
    case CreditCardBrands.AmericanExpress:
      // TODO handle SVGs
      // return <IconAmericanExpress />;
      return <Text>(American Express)</Text>;
    case CreditCardBrands.Discover:
      // TODO handle SVGs
      // return <IconDiscover />;
      return <Text>(Discover)</Text>;
    default:
      // TODO handle SVGs
      // return <IconCreditCard />;
      return <Text>(Other Card)</Text>;
  }
};

export const CreditCard: FC<CreditCardProps> = ({
  index,
  data,
  isDefault,
  // activeMethod, // TODO handle activeMethod
  setActiveCallback,
  onSetDefaultRequested,
  onDeleteRequested,
}: CreditCardProps) => {
  const { deleteDefault, displayDelete, displaySetDefault, displayRadio } =
    useWalletContext();

  const expired: boolean = useMemo<boolean>(() => {
    return isExpired(data.details.expirationDate);
  }, [data.details.expirationDate]);

  const icon: JSX.Element = useMemo<JSX.Element>(() => {
    return getIconFromBrand(data.details.brand);
  }, [data.details.brand]);

  const innerText = `
        ${data.details.brand}
        ending with
        ${data.details.last_4}
    `;

  const isDefaultText = useMemo<JSX.Element>(() => {
    return (
      <Text
        style={tw`text-gray mx-2`}
        data-testid={`Saved__Payment__Default__Credit__Card__${index}`}
      >
        Default
      </Text>
    );
  }, [index]);

  const makeDefaultButton = useMemo<JSX.Element>(() => {
    return (
      <Button
        title="Make default"
        data-testid={`Saved__Payment__Make__Default__Action__Credit__Card__${index}`}
        onPress={() => onSetDefaultRequested?.(data)}
        color="secondary"
      />
    );
  }, [onSetDefaultRequested, data, index]);

  const deleteButton = useMemo<JSX.Element>(() => {
    return (
      <TouchableOpacity
        data-testid={`Saved__Payment__Remove__Action__Credit__Card__${index}`}
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
        data-testid={`Saved__Payment__Credit__Card__${index}`}
      >
        <View
          style={tw`w-12 flex justify-center`}
          data-testid={`Saved__Payment__Stripe__Icon__${index}`}
        >
          {icon}
        </View>
        {displayRadio ? (
          <TouchableOpacity
            // TODO
            // color="interactive"
            // checked={activeMethod === data}
            onPress={() => setActiveCallback(data)}
            disabled={expired}
            style={tw`mx-2`}
            data-testid={`Saved__Payment__Radio__Credit__Card__${index}`}
          >
            <Text>{innerText}</Text>
          </TouchableOpacity>
        ) : (
          <View style={tw`flex items-center`}>
            <Text
              style={tw`mx-2`}
              data-testid={`Saved__Payment__Text__Credit__Card__${index}`}
            >
              {innerText}
            </Text>
          </View>
        )}
        {expired && (
          <Text data-testid={`Saved__Payment__Expired__Credit__Card__${index}`}>
            Expired
          </Text>
        )}
        <View style={tw`ml-auto flex items-center flex-row`}>
          {isDefault ? isDefaultText : displaySetDefault && makeDefaultButton}
          {(!isDefault || deleteDefault) && displayDelete ? deleteButton : null}
        </View>
      </View>
    </View>
  );
};
