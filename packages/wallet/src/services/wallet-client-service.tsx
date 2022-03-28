import { WalletJSClient, walletpb } from "@ftdr/wallet-js-client";
import {
  getListFromApi,
  getModelFromApi,
  getProtoFromStore,
  PaymentMethod,
  PaymentMethodBackendStore,
} from "../models";

export function getAllPaymentMethods(
  client: WalletJSClient,
  contractID: number | undefined,
  successCallback: (data: PaymentMethod[]) => void,
  failureCallback: (data: PaymentMethod[]) => void,
  customerID: number | undefined
): void {
  client
    .getPaymentMethods(
      new walletpb.GetPaymentMethodsRequest({
        contractID,
        customerID,
      })
    )
    .then(
      ({ data }) => {
        successCallback(
          data.paymentMethod ? getListFromApi(data.paymentMethod) : []
        );
      },
      () => {
        failureCallback([]);
      }
    );
}

export function getDefaultPaymentMethod(
  client: WalletJSClient,
  contractID: number,
  successCallback: (data: PaymentMethod | undefined) => void,
  failureCallback: (data: PaymentMethod | undefined) => void
): void {
  client
    .getDefaultPaymentMethod(
      new walletpb.GetDefaultPaymentMethodRequest({
        contractID,
      })
    )
    .then(
      ({ data }) => {
        successCallback(
          data.paymentMethod ? getModelFromApi(data.paymentMethod) : undefined
        );
      },
      () => {
        failureCallback(undefined);
      }
    );
}

export function updateDefaultPaymentMethod(
  client: WalletJSClient,
  contractID: number,
  newDefault: PaymentMethod,
  successCallback?: (data: PaymentMethod | undefined) => void,
  failureCallback?: () => void,
  customerID?: number,
  propertyID?: number,
  sourceTypeCode?: string
): void {
  client
    .updateDefaultPaymentMethod(
      new walletpb.UpdateDefaultPaymentMethodRequest({
        contractID,
        customerID,
        dataStore: getProtoFromStore(newDefault.stores[0]),
        sourceTypeCode,
        propertyID,
      })
    )
    .then(
      (response) => {
        if (response.status === 200 && response.data) {
          successCallback?.(
            response.data.paymentMethod
              ? getModelFromApi(response.data.paymentMethod)
              : undefined
          );
        } else {
          failureCallback?.();
        }
      },
      () => {
        failureCallback?.();
      }
    );
}

export function deletePaymentMethod(
  client: WalletJSClient,
  dataStores: PaymentMethodBackendStore[],
  successCallback: () => void,
  failureCallback: () => void
): void {
  client
    .deletePaymentMethod(
      new walletpb.DeletePaymentMethodRequest({
        dataStore: dataStores.map(getProtoFromStore),
      })
    )
    .then(
      () => {
        successCallback?.();
      },
      (e) => {
        if (
          e.message.includes("$root.google.protobuf.Empty is not a constructor")
        ) {
          successCallback?.();
        } else {
          failureCallback?.();
        }
      }
    );
}
