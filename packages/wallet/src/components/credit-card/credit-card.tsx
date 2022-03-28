import {
  Badge,
  IconAmericanExpress,
  IconCreditCard,
  IconDiscover,
  IconMastercard,
  IconTrash,
  IconVisa,
  Link,
  Radio,
  Text,
} from "@ftdr/blueprint-components-react";
import React, { FC, useMemo } from "react";
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
      return <IconVisa />;
    case CreditCardBrands.MasterCard:
      return <IconMastercard />;
    case CreditCardBrands.AmericanExpress:
      return <IconAmericanExpress />;
    case CreditCardBrands.Discover:
      return <IconDiscover />;
    default:
      return <IconCreditCard />;
  }
};

export const CreditCard: FC<CreditCardProps> = ({
  index,
  data,
  isDefault,
  activeMethod,
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
        color="gray"
        className="mx-2"
        data-testid={`Saved__Payment__Default__Credit__Card__${index}`}
      >
        Default
      </Text>
    );
  }, [index]);

  const makeDefaultButton = useMemo<JSX.Element>(() => {
    return (
      <Link
        data-testid={`Saved__Payment__Make__Default__Action__Credit__Card__${index}`}
        onClick={() => onSetDefaultRequested?.(data)}
        className="mx-2"
        color="secondary"
      >
        Make default
      </Link>
    );
  }, [onSetDefaultRequested, data, index]);

  const deleteButton = useMemo<JSX.Element>(() => {
    return (
      <Link
        data-testid={`Saved__Payment__Remove__Action__Credit__Card__${index}`}
        onClick={() => onDeleteRequested?.(data)}
        className="mx-3 align-baseline"
      >
        <IconTrash />
      </Link>
    );
  }, [onDeleteRequested, data, index]);

  return (
    <div className="border-solid border-1 border-gray-300 rounded-3 my-1">
      <div
        className="flex justify-between shadow-raised px-6 py-6"
        data-testid={`Saved__Payment__Credit__Card__${index}`}
      >
        <div
          className="w-12 flex justify-center"
          data-testid={`Saved__Payment__Stripe__Icon__${index}`}
        >
          {icon}
        </div>
        {displayRadio ? (
          <Radio
            color="interactive"
            label={innerText}
            checked={activeMethod === data}
            onChange={() => setActiveCallback(data)}
            disabled={expired}
            className="mx-2"
            data-testid={`Saved__Payment__Radio__Credit__Card__${index}`}
            id={`Saved__Payment__Radio__${index}`}
          />
        ) : (
          <div className="flex items-center">
            <Text
              className="mx-2"
              data-testid={`Saved__Payment__Text__Credit__Card__${index}`}
              id={`Saved__Payment__Text__${index}`}
            >
              {innerText}
            </Text>
          </div>
        )}
        {expired && (
          <Badge
            className="px-2 py-1"
            color="error"
            data-testid={`Saved__Payment__Expired__Credit__Card__${index}`}
          >
            Expired
          </Badge>
        )}
        <div className="ml-auto flex items-center flex-row">
          {isDefault ? isDefaultText : displaySetDefault && makeDefaultButton}
          {(!isDefault || deleteDefault) && displayDelete ? deleteButton : ""}
        </div>
      </div>
    </div>
  );
};
