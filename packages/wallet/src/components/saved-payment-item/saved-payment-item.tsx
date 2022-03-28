import React, { FC } from "react";
import { isAchAccount, isCreditCard, PaymentMethod } from "../../models";
import ACHAccount, { ACHAccountProps } from "../ach-account";
import CreditCard, { CreditCardProps } from "../credit-card";

export type SavedPaymentItemPassthroughProps = {
  index: number;
  activeMethod?: PaymentMethod;
  data: PaymentMethod;
  isDefault: boolean;
  setActiveCallback: (newActivePayment: PaymentMethod) => void;
  onSetDefaultRequested?: (newDefaultPaymentMethod: PaymentMethod) => void;
  onDeleteRequested?: (paymentMethod: PaymentMethod) => void;
};

export type SavedPaymentItemProps = SavedPaymentItemPassthroughProps;

export const SavedPaymentItem: FC<SavedPaymentItemProps> = (
  props: SavedPaymentItemProps
) => {
  if (isCreditCard(props.data)) {
    return <CreditCard {...(props as CreditCardProps)} />;
  } else if (isAchAccount(props.data)) {
    return <ACHAccount {...(props as ACHAccountProps)} />;
  } else {
    return <></>;
  }
};
