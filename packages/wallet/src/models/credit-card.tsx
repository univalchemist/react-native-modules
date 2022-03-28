import { walletpb } from "@ftdr/wallet-js-client";
import { PaymentMethod } from "./payment-method";

export interface ExpirationDate {
  year: number;
  month: number;
  day: number;
}

export enum CreditCardBrands {
  Undefined = "Credit Card",
  AmericanExpress = "American Express",
  DinersClub = "Diner's Club",
  Discover = "Discover",
  JCB = "JCB",
  MasterCard = "Mastercard",
  UnionPay = "UnionPay",
  Visa = "Visa",
}

export function apiBrandToModelBrand(
  api: walletpb.CreditCardBrand | null | undefined
): CreditCardBrands {
  if (!api) {
    return CreditCardBrands.Undefined;
  }
  switch (api) {
    case walletpb.CreditCardBrand.AmericanExpress:
      return CreditCardBrands.AmericanExpress;
    case walletpb.CreditCardBrand.DinersClub:
      return CreditCardBrands.DinersClub;
    case walletpb.CreditCardBrand.Discover:
      return CreditCardBrands.Discover;
    case walletpb.CreditCardBrand.JCB:
      return CreditCardBrands.JCB;
    case walletpb.CreditCardBrand.MasterCard:
      return CreditCardBrands.MasterCard;
    case walletpb.CreditCardBrand.UnionPay:
      return CreditCardBrands.UnionPay;
    case walletpb.CreditCardBrand.Visa:
      return CreditCardBrands.Visa;
    default:
      return CreditCardBrands.Undefined;
  }
}

export interface CreditCardDetails {
  brand: CreditCardBrands;
  last_4: string;
  expirationDate: ExpirationDate;
  country?: string;
}

export interface CreditCard extends PaymentMethod {
  details: CreditCardDetails;
}

export function isCreditCard(
  paymentMethod: PaymentMethod
): paymentMethod is CreditCard {
  return (
    (paymentMethod as CreditCard).details !== undefined &&
    (paymentMethod as CreditCard).details.last_4 !== undefined
  );
}
