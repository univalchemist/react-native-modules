import { Link, useAppContext } from "@ftdr/blueprint-components-react";
import React from "react";
import { useWalletContext } from "../context/wallet-context/use-wallet-context";
import { PaymentMethod, paymentMethodsAreEqual } from "../models";
import WalletEmptyView from "./empty-mfe-view";
import SavedPaymentItem from "./saved-payment-item";

// this should move to an API file once those are ready

export type WalletUIProps = {
  // ------------------------- UI Related Value Props -------------------------
  activeMethod?: PaymentMethod;
  defaultMethod?: PaymentMethod;
  savedPayments: PaymentMethod[];
  // ------------------------- UI Related Event Props -------------------------
  addPaymentMethodPressedAction?: (event: React.MouseEvent) => void;
  setActiveCallback: (newActiveMethod: PaymentMethod) => void;
  onSetDefaultRequested?: (newDefaultPaymentMethod: PaymentMethod) => void;
  onDeleteRequested?: (paymentMethod: PaymentMethod) => void;
};

export const WalletUI: React.FC<WalletUIProps> = (props: WalletUIProps) => {
  const {
    appSettings: { localizedText },
  } = useAppContext();
  const { displayAddPaymentMethod } = useWalletContext();

  return (
    <div>
      {displayAddPaymentMethod && (
        <div className="d-block mt-2 mb-3 flex justify-end">
          <Link
            data-testid={`Stored__Payment__Method__Add__Card`}
            color="primary"
            onClick={props.addPaymentMethodPressedAction}
          >
            + {localizedText("ADD_PAYMENT_METHOD_LABEL")}
          </Link>
        </div>
      )}
      {props.savedPayments.length > 0 ? (
        props.savedPayments.map((savedPayment, index) => {
          return (
            <SavedPaymentItem
              index={index}
              key={savedPayment.stores ? savedPayment.stores[0].id : -1}
              data={savedPayment}
              isDefault={
                props.defaultMethod
                  ? paymentMethodsAreEqual(props.defaultMethod, savedPayment)
                  : false
              }
              activeMethod={props.activeMethod}
              setActiveCallback={props.setActiveCallback}
              onSetDefaultRequested={props.onSetDefaultRequested}
              onDeleteRequested={props.onDeleteRequested}
            />
          );
        })
      ) : (
        <WalletEmptyView />
      )}
    </div>
  );
};
