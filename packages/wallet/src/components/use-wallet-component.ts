import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { PaymentMethod } from "../models";
import { getAllPaymentMethods, getDefaultPaymentMethod } from "../services";
import { WalletComponentProps } from "./wallet-component";

type UseWalletComponentReturnType = {
  getPaymentMethods: (
    data: Pick<WalletComponentProps, "contractId" | "customerId">
  ) => Promise<PaymentMethod[]>;
  isLoaded: boolean;
  activeMethod?: PaymentMethod;
  defaultMethod?: PaymentMethod;
  savedPayments: PaymentMethod[];
  setActiveMethod: Dispatch<SetStateAction<PaymentMethod | undefined>>;
  setDefaultMethod: Dispatch<SetStateAction<PaymentMethod | undefined>>;
  setSavedPayments: Dispatch<SetStateAction<PaymentMethod[]>>;
};

const sortPaymentMethods = (item1: PaymentMethod, item2: PaymentMethod) => {
  if (item1.default) {
    return -1;
  } else if (item2.default) {
    return 1;
  } else {
    return +item1 - +item2;
  }
};

export const useWalletComponent = ({
  protobufClient,
}: Pick<
  WalletComponentProps,
  "protobufClient"
>): UseWalletComponentReturnType => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>();
  const [defaultMethod, setDefaultMethod] = useState<PaymentMethod>();
  const [savedPayments, setSavedPayments] = useState<PaymentMethod[]>([]);

  const getPaymentMethods = useCallback(
    ({
      contractId,
      customerId,
    }: Pick<WalletComponentProps, "contractId" | "customerId">): Promise<
      PaymentMethod[]
    > => {
      setIsLoaded(false);
      setSavedPayments([]);
      return new Promise<PaymentMethod[]>((resolve) => {
        getAllPaymentMethods(
          protobufClient,
          contractId,
          (savedPayments) => {
            setSavedPayments(savedPayments.sort(sortPaymentMethods));
            if (!contractId) {
              setIsLoaded(true);
            }
            resolve(savedPayments);
          },
          (savedPayments) => {
            setSavedPayments(savedPayments.sort(sortPaymentMethods));
            if (!contractId) {
              setIsLoaded(true);
            }
            resolve(savedPayments);
          },
          customerId
        );
        if (contractId) {
          getDefaultPaymentMethod(
            protobufClient,
            contractId,
            (paymentMethod) => {
              setDefaultMethod(paymentMethod);
              setIsLoaded(true);
            },
            (paymentMethod) => {
              setDefaultMethod(paymentMethod);
              setIsLoaded(true);
            }
          );
        }
      });
    },
    [protobufClient]
  );

  return {
    getPaymentMethods,
    setActiveMethod,
    setSavedPayments,
    setDefaultMethod,
    isLoaded,
    activeMethod,
    defaultMethod,
    savedPayments,
  };
};
