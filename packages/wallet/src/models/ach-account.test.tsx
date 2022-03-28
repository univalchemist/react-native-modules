import { ACHAccount, isAchAccount } from "./ach-account";
import { CreditCard, CreditCardBrands } from "./credit-card";
import { PaymentMethod } from "./payment-method";

describe("ACHAccountModel", () => {
  test("isAchAccount should return true if payment method has account number", () => {
    const expected = true;
    const result = isAchAccount({
      stores: [{ id: "ffff" }],
      default: false,
      details: {
        account_number: "123412341234",
      },
    } as ACHAccount);
    expect(result).toBe(expected);
  });

  test("isAchAccount should return false for credit cards", () => {
    const expected = false;
    const result = isAchAccount({
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

  test("isAchAccount should return false on generic payment methods", () => {
    const expected = false;
    const result = isAchAccount({
      stores: [{ id: "ffff" }],
      default: false,
    } as PaymentMethod);
    expect(result).toBe(expected);
  });
});
