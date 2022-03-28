import { render } from "@testing-library/react";
import React from "react";
import {
  ACHAccount as ACHAccountModel,
  CreditCard as CreditCardModel,
  CreditCardBrands,
} from "../../models";
import ACHAccount from "../ach-account";
import CreditCard from "../credit-card";
import { SavedPaymentItem, SavedPaymentItemProps } from "./saved-payment-item";

const mockCallback = jest.fn();

const props: SavedPaymentItemProps = {
  index: 1,
  data: {
    stores: [
      {
        id: "ffff",
      },
    ],
    default: false,
    details: {
      brand: CreditCardBrands.Visa,
      expirationDate: {
        day: 1,
        month: 1,
        year: 2018,
      },
      last_4: "4242",
    },
  },
  isDefault: false,
  setActiveCallback: mockCallback,
  onSetDefaultRequested: mockCallback,
  onDeleteRequested: mockCallback,
};

describe("SavedPaymentItem", () => {
  test("should render", () => {
    render(<SavedPaymentItem {...props} />);
    expect(SavedPaymentItem).not.toBeNull();
  });

  test("should render credit card if props are CreditCard model", () => {
    render(
      <SavedPaymentItem
        index={1}
        data={
          {
            stores: [
              {
                id: "ffff",
              },
            ],
            default: false,
            details: {
              brand: CreditCardBrands.Visa,
              last_4: "4242",
              expirationDate: {
                day: 12,
                month: 12,
                year: 9999,
              },
            },
          } as CreditCardModel
        }
        isDefault={false}
        setActiveCallback={mockCallback}
        onSetDefaultRequested={mockCallback}
        onDeleteRequested={mockCallback}
      />
    );
    expect(CreditCard).not.toBeNull();
  });

  test("should render ach account if props are ACH account model", () => {
    render(
      <SavedPaymentItem
        index={1}
        data={
          {
            stores: [
              {
                id: "ffff",
              },
            ],
            default: false,
            details: {
              account_number: "123412341234",
              routing_number: "123412344",
            },
          } as ACHAccountModel
        }
        isDefault={false}
        setActiveCallback={mockCallback}
        onSetDefaultRequested={mockCallback}
        onDeleteRequested={mockCallback}
      />
    );
    expect(ACHAccount).not.toBeNull();
  });
});
