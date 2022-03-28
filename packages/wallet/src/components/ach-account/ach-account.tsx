import {
  IconCreditCard2,
  IconTrash,
  Link,
  Radio,
  Text,
} from "@ftdr/blueprint-components-react";
import React, { FC, useMemo } from "react";
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
  activeMethod,
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
        color="gray"
        className="mx-2"
        data-testid={`Saved__Payment__Default__ACH__${index}`}
      >
        Default
      </Text>
    );
  }, [index]);

  const makeDefaultButton = useMemo<JSX.Element>(() => {
    return (
      <Link
        data-testid={`Saved__Payment__Make__Default__Action__ACH__${index}`}
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
        data-testid={`Saved__Payment__Remove__Action__ACH__${index}`}
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
        data-testid={`Saved__Payment__ACH__${index}`}
      >
        <div
          className="w-12 flex justify-center"
          data-testid={`Saved__Payment__ACH__Icon__${index}`}
        >
          <IconCreditCard2 />
        </div>
        {displayRadio ? (
          <Radio
            color="interactive"
            label={innerText}
            checked={activeMethod === data}
            onChange={() => setActiveCallback(data)}
            className="mx-2"
            data-testid={`Saved__Payment__Radio__ACH__${index}`}
            id={`Saved__Payment__Radio__ACH__${index}`}
          />
        ) : (
          <div className="flex items-center">
            <Text
              className="mx-2"
              data-testid={`Saved__Payment__Text__ACH__${index}`}
              id={`Saved__Payment__Text__${index}`}
            >
              {innerText}
            </Text>
          </div>
        )}
        <div className="ml-auto flex items-center flex-row">
          {isDefault ? isDefaultText : displaySetDefault && makeDefaultButton}
          {(!isDefault || deleteDefault) && displayDelete ? deleteButton : ""}
        </div>
      </div>
    </div>
  );
};
