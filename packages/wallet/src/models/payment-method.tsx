import { walletpb } from "@ftdr/wallet-js-client";
import { ACHAccount, ACHDetails } from "./ach-account";
import {
  apiBrandToModelBrand,
  CreditCard,
  CreditCardDetails,
} from "./credit-card";

export type PaymentMethodID = string;

export interface PaymentMethod {
  stores: PaymentMethodBackendStore[];
  default?: boolean;
  details?: CreditCardDetails | ACHDetails;
}

export interface PaymentMethodBackendStore {
  id?: string;
  source?: walletpb.DataLocation;
}

export function getStoreFromBackend(
  store: walletpb.DataStore
): PaymentMethodBackendStore {
  return {
    id: store.id,
    source: store.dataLocation,
  } as PaymentMethodBackendStore;
}

export function getProtoFromStore(
  store: PaymentMethodBackendStore
): walletpb.DataStore {
  return {
    id: store.id,
    dataLocation: store.source,
  } as walletpb.DataStore;
}

export function getListFromApi(
  paymentMethods: walletpb.IPaymentMethod[]
): PaymentMethod[] {
  return paymentMethods
    .filter((paymentMethod) => {
      return paymentMethod.details?.type;
    })
    .map<PaymentMethod>((paymentMethod) => {
      return getModelFromApi(paymentMethod);
    });
}

export function getDatastoresFromApi(
  datastore: walletpb.IDataStore[] | undefined | null
): PaymentMethodBackendStore[] {
  if (!datastore) {
    return [];
  }
  return datastore.map<PaymentMethodBackendStore>((store) => {
    return {
      id: store.id || undefined,
      source: store.dataLocation || undefined,
    };
  });
}

export function getModelFromApi(
  paymentMethod: walletpb.IPaymentMethod
): PaymentMethod {
  if (paymentMethod.details?.type === walletpb.PaymentMethodType.CreditCard) {
    return {
      stores: getDatastoresFromApi(paymentMethod.dataStore),
      default: paymentMethod.default,
      details: {
        brand: apiBrandToModelBrand(paymentMethod.details.cc?.brand),
        expirationDate: paymentMethod.details.cc?.expirationDate,
        last_4: paymentMethod.details.cc?.last4,
        country: paymentMethod.details.cc?.country,
      },
    } as CreditCard;
  } else if (paymentMethod.details?.type === walletpb.PaymentMethodType.ACH) {
    return {
      stores: getDatastoresFromApi(paymentMethod.dataStore),
      default: paymentMethod.default,
      details: {
        account_number: paymentMethod.details.ach?.accountNumber,
        routing_number: paymentMethod.details.ach?.routingNumber,
      },
    } as ACHAccount;
  } else {
    return {
      stores: getDatastoresFromApi(paymentMethod.dataStore),
      default: paymentMethod.default,
    } as PaymentMethod;
  }
}

export function paymentMethodsAreEqual(
  firstMethod: PaymentMethod,
  secondMethod: PaymentMethod
): boolean {
  for (let i = 0; i < firstMethod.stores.length; i++) {
    for (let j = 0; j < secondMethod.stores.length; j++) {
      if (
        firstMethod.stores[i].id === secondMethod.stores[j].id &&
        firstMethod.stores[i].source === secondMethod.stores[j].source
      ) {
        return true;
      }
    }
  }
  return false;
}
