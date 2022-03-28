import { ProgressIndicator } from "@ftdr/blueprint-components-react";
import { WalletJSClient } from "@ftdr/wallet-js-client";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import { ACHAccount, CreditCard, PaymentMethod } from "../models";
import { deletePaymentMethod, updateDefaultPaymentMethod } from "../services";
import { useWalletComponent } from "./use-wallet-component";
import { WalletUI } from "./wallet-ui";

export type WalletComponentProps = {
  // ------------------- Backend Integration Related Props --------------------
  protobufClient: WalletJSClient;
  propertyId?: number;
  sourceTypeCode?: string;
  // ------------------- Business Logic Related Value Props -------------------
  contractId?: number;
  customerId?: number;
  // ------------------- Business Logic Related Event Props -------------------
  savedPaymentMethodSelectedCallback?: (
    paymentMethod?: PaymentMethod | CreditCard | ACHAccount
  ) => void;
  addPaymentMethodPressedAction?: (event: React.MouseEvent) => void;
  onSetDefaultRequested?: (
    newDefaultPaymentMethod: PaymentMethod | CreditCard | ACHAccount
  ) => void;
  onDeleteRequested?: (
    paymentMethod: PaymentMethod | CreditCard | ACHAccount
  ) => void;
};

export type WalletComponentExposedApi = {
  getCurrentSavedPaymentMethod: () =>
    | PaymentMethod
    | CreditCard
    | ACHAccount
    | undefined;
  refreshPaymentMethodList: () => Promise<PaymentMethod[]> | undefined;
  setActivePaymentMethod: (paymentMethod: PaymentMethod | undefined) => void;
  setDefaultPaymentMethod: (
    paymentMethod: PaymentMethod,
    onSuccess: (newDefault: PaymentMethod | undefined) => void,
    onFailure: () => void
  ) => void;
  deletePaymentMethod: (
    paymentMethod: PaymentMethod,
    onSuccess: () => void,
    onFailure: () => void
  ) => void;
};

export const WalletComponent = forwardRef<
  WalletComponentExposedApi,
  WalletComponentProps
>(
  (
    {
      protobufClient,
      contractId,
      savedPaymentMethodSelectedCallback,
      customerId,
      propertyId,
      sourceTypeCode,
      addPaymentMethodPressedAction,
      onSetDefaultRequested,
      onDeleteRequested,
    }: WalletComponentProps,
    ref
  ) => {
    const {
      isLoaded,
      activeMethod,
      defaultMethod,
      savedPayments,
      setActiveMethod,
      setDefaultMethod,
      getPaymentMethods,
    } = useWalletComponent({ protobufClient });

    const setActiveCallback = useMemo(() => {
      return (newActiveSavedPayment: PaymentMethod | undefined): void => {
        setActiveMethod(newActiveSavedPayment);
        if (savedPaymentMethodSelectedCallback) {
          savedPaymentMethodSelectedCallback(newActiveSavedPayment);
        }
      };
    }, [savedPaymentMethodSelectedCallback, setActiveMethod]);

    const setDefaultCallback = useMemo(() => {
      return (
        newMethod: PaymentMethod,
        onSuccess: (newDefault: PaymentMethod | undefined) => void,
        onFailure: () => void
      ): void => {
        if (contractId) {
          updateDefaultPaymentMethod(
            protobufClient,
            contractId,
            newMethod,
            (responseMethod: PaymentMethod | undefined) => {
              setDefaultMethod(responseMethod);
              onSuccess(responseMethod);
            },
            onFailure,
            customerId,
            propertyId,
            sourceTypeCode
          );
        }
      };
    }, [
      protobufClient,
      contractId,
      customerId,
      propertyId,
      sourceTypeCode,
      setDefaultMethod,
    ]);

    const deletePaymentMethodCallback = useMemo(() => {
      return (
        method: PaymentMethod,
        onSuccess: () => void,
        onFailure: () => void
      ): void => {
        deletePaymentMethod(
          protobufClient,
          method.stores,
          () => {
            getPaymentMethods({ contractId, customerId });
            onSuccess?.();
          },
          onFailure
        );
      };
    }, [protobufClient, contractId, customerId, getPaymentMethods]);

    useImperativeHandle(
      ref,
      () => ({
        getCurrentSavedPaymentMethod: () => {
          return activeMethod;
        },
        refreshPaymentMethodList: () => {
          return getPaymentMethods({ contractId, customerId });
        },
        setActivePaymentMethod: (paymentMethod: PaymentMethod | undefined) => {
          setActiveCallback(paymentMethod);
        },
        setDefaultPaymentMethod: (
          paymentMethod: PaymentMethod,
          onSuccess: (newDefault: PaymentMethod | undefined) => void,
          onFailure: () => void
        ) => {
          setDefaultCallback(paymentMethod, onSuccess, onFailure);
        },
        deletePaymentMethod: (
          paymentMethod: PaymentMethod,
          onSuccess: () => void,
          onFailure: () => void
        ) => {
          deletePaymentMethodCallback(paymentMethod, onSuccess, onFailure);
        },
      }),
      [
        activeMethod,
        contractId,
        customerId,
        getPaymentMethods,
        setActiveCallback,
        setDefaultCallback,
        deletePaymentMethodCallback,
      ]
    );

    useEffect(() => {
      getPaymentMethods({ contractId, customerId });
    }, [contractId, customerId, getPaymentMethods]);

    const walletNotLoadedUI = useMemo(() => {
      return (
        <div className="flex justify-center">
          <ProgressIndicator variant="circular" color="primary" size="large" />
        </div>
      );
    }, []);

    return isLoaded ? (
      <WalletUI
        // passthrough props
        {...{
          setActiveCallback,
          activeMethod,
          defaultMethod,
          savedPayments,
          addPaymentMethodPressedAction,
          onSetDefaultRequested,
          onDeleteRequested,
        }}
      />
    ) : (
      walletNotLoadedUI
    );
  }
);

WalletComponent.displayName = "WalletComponent";
