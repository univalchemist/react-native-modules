import { PaymentMethod } from "./payment-method";

export interface ACHDetails {
  account_number: string;
  routing_number: string;
}

export interface ACHAccount extends PaymentMethod {
  details: ACHDetails;
}

export function isAchAccount(
  paymentMethod: PaymentMethod
): paymentMethod is ACHAccount {
  return (
    (paymentMethod as ACHAccount).details !== undefined &&
    (paymentMethod as ACHAccount).details.account_number !== undefined
  );
}
