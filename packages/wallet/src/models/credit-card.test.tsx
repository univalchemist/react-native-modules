import { walletpb } from "@ftdr/wallet-js-client";
import { ACHAccount } from "./ach-account";
import {
  apiBrandToModelBrand,
  CreditCard,
  CreditCardBrands,
  isCreditCard,
} from "./credit-card";
import { PaymentMethod } from "./payment-method";

describe("CreditCardModel", () => {
  test("isCreditCard should return true if payment method has last four", () => {
    const expected = true;
    const result = isCreditCard({
      stores: [{ id: "ffff" }],
      default: false,
      details: {
        brand: CreditCardBrands.AmericanExpress,
        expirationDate: { day: 31, month: 12, year: 2022 },
        last_4: "1234",
      },
    } as CreditCard);
    expect(result).toBe(expected);
  });

  test("isCreditCard should return false for ach accounts", () => {
    const expected = false;
    const result = isCreditCard({
      stores: [{ id: "ffff" }],
      default: false,
      details: {
        account_number: "123412341234",
      },
    } as ACHAccount);
    expect(result).toBe(expected);
  });

  test("isCreditCard should return false on generic payment methods", () => {
    const expected = false;
    const result = isCreditCard({
      stores: [{ id: "ffff" }],
      default: false,
    } as PaymentMethod);
    expect(result).toBe(expected);
  });

  test("all credit card brands have string match", () => {
    const labelledBrands = Array<CreditCardBrands>();
    for (const key in walletpb.CreditCardBrand) {
      if (
        Number(key) &&
        //This looks terrible; but a backend break would be the only thing to cause this,
        //so we shouldn't test against it.
        Number(key) !== walletpb.CreditCardBrand.Undefined_Brand
      ) {
        labelledBrands.push(apiBrandToModelBrand(Number(key)));
      }
    }
    expect(labelledBrands).not.toContain(CreditCardBrands.Undefined);
  });
});
