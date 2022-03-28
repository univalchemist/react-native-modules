import {
  DecoratedHttpClient,
  ProtobufHttpClient,
  TokenHandlingHttpClient,
} from "@ftdr/http-utils";
import { WalletJSClient } from "@ftdr/wallet-js-client";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import {
  WalletComponent,
  WalletComponentExposedApi,
  WalletComponentProps,
} from "./components";
import {
  walletContextInitialState,
  WalletContextProvider,
  WalletContextState,
} from "./context/wallet-context/use-wallet-context";
import { PaymentMethod } from "./models";

export type WalletMicroFrontendOwnProps = {
  /**
   * The baseURL to be used for the WalletService.
   */
  baseURL: string;
  /**
   * The tenant service to be used by as a header
   * default: ahs
   */
  tenant?: string;
  /**
   * The token to be used for the WalletService.
   */
  token: string;
  /**
   * Config props
   */
  displayDelete?: boolean;
  displaySetDefault?: boolean;
  displayRadio?: boolean;
  displayAddPaymentMethod?: boolean;
  canDeleteDefault?: boolean;
};

export type WalletComponentPassthroughProps = Pick<
  WalletComponentProps,
  | "savedPaymentMethodSelectedCallback"
  | "contractId"
  | "customerId"
  | "propertyId"
  | "sourceTypeCode"
  | "addPaymentMethodPressedAction"
  | "onSetDefaultRequested"
  | "onDeleteRequested"
>;

export type WalletMicroFrontendProps = WalletMicroFrontendOwnProps &
  WalletComponentPassthroughProps;

export type WalletExposedApi = WalletComponentExposedApi;

export class CustomTenantHttpClient extends DecoratedHttpClient {
  defaults: DecoratedHttpClient["defaults"] = {
    headers: {
      common: {
        ["X-Tenant"]: this.tenant,
      },
    },
  };

  constructor(token: string, private tenant: string) {
    super(new TokenHandlingHttpClient(token));
    this.mergeDefaults();
  }
}

export const WalletMicroFrontend = forwardRef<
  WalletExposedApi | undefined,
  WalletMicroFrontendProps
>(
  (
    {
      canDeleteDefault,
      displayDelete,
      displayRadio,
      displaySetDefault,
      displayAddPaymentMethod,
      token,
      baseURL,
      tenant,
      contractId,
      customerId,
      propertyId,
      sourceTypeCode,
      savedPaymentMethodSelectedCallback,
      addPaymentMethodPressedAction,
      onSetDefaultRequested,
      onDeleteRequested,
    }: WalletMicroFrontendProps,
    ref
  ) => {
    const walletRef = useRef<WalletComponentExposedApi>(null);
    const contextValue = useMemo<WalletContextState>(() => {
      return {
        deleteDefault:
          canDeleteDefault !== undefined
            ? canDeleteDefault
            : walletContextInitialState.deleteDefault,
        displayDelete:
          displayDelete !== undefined
            ? displayDelete
            : walletContextInitialState.displayDelete,
        displayRadio:
          displayRadio !== undefined
            ? displayRadio
            : walletContextInitialState.displayRadio,
        displaySetDefault:
          displaySetDefault !== undefined
            ? displaySetDefault
            : walletContextInitialState.displaySetDefault,
        displayAddPaymentMethod:
          displayAddPaymentMethod !== undefined
            ? displayAddPaymentMethod
            : walletContextInitialState.displayAddPaymentMethod,
      };
    }, [
      canDeleteDefault,
      displayDelete,
      displayRadio,
      displaySetDefault,
      displayAddPaymentMethod,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        getCurrentSavedPaymentMethod: () => {
          return walletRef?.current?.getCurrentSavedPaymentMethod();
        },
        refreshPaymentMethodList: () =>
          walletRef?.current?.refreshPaymentMethodList(),
        setActivePaymentMethod: (paymentMethod = undefined) => {
          walletRef?.current?.setActivePaymentMethod(paymentMethod);
        },
        setDefaultPaymentMethod: (
          paymentMethod: PaymentMethod,
          onSuccess: (newDefault: PaymentMethod | undefined) => void,
          onFailure: () => void
        ) => {
          walletRef?.current?.setDefaultPaymentMethod(
            paymentMethod,
            onSuccess,
            onFailure
          );
        },
        deletePaymentMethod: (
          paymentMethod: PaymentMethod,
          onSuccess: () => void,
          onFailure: () => void
        ) => {
          walletRef?.current?.deletePaymentMethod(
            paymentMethod,
            onSuccess,
            onFailure
          );
        },
      }),
      [walletRef]
    );

    const walletJsClient = useMemo(() => {
      const tokenHttpClient = new CustomTenantHttpClient(
        token,
        tenant || "ahs"
      );
      const protoBuffHttpClient = new ProtobufHttpClient(tokenHttpClient);
      return new WalletJSClient(baseURL, protoBuffHttpClient);
    }, [baseURL, token, tenant]);

    return (
      <WalletContextProvider value={contextValue}>
        <WalletComponent
          contractId={contractId}
          customerId={customerId}
          propertyId={propertyId}
          sourceTypeCode={sourceTypeCode}
          savedPaymentMethodSelectedCallback={
            savedPaymentMethodSelectedCallback
          }
          addPaymentMethodPressedAction={addPaymentMethodPressedAction}
          onSetDefaultRequested={onSetDefaultRequested}
          onDeleteRequested={onDeleteRequested}
          protobufClient={walletJsClient}
          ref={walletRef}
        />
      </WalletContextProvider>
    );
  }
);

WalletMicroFrontend.displayName = "WalletMicroFrontend";
