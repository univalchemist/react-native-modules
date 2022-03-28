import { fireEvent, render as renderRaw } from "@testing-library/react";
import React from "react";
import {
  walletContextInitialState,
  WalletContextProvider,
  WalletContextState,
} from "../../context/wallet-context/use-wallet-context";
import { CreditCardBrands } from "../../models";
import { CreditCard, CreditCardProps } from "./credit-card";

const mockActiveSetter = jest.fn();
const mockDefaultSetter = jest.fn();
const mockDeleteSetter = jest.fn();

const render = (children: React.ReactElement, context?: WalletContextState) => {
  return renderRaw(
    <WalletContextProvider value={context || walletContextInitialState}>
      {children}
    </WalletContextProvider>
  );
};

function makeCreditCard({
  onSetDefaultRequested = undefined as jest.Mock | undefined,
  onDeleteRequested = undefined as jest.Mock | undefined,
  index = 1,
  id = "ffff",
  defaultStatus = false,
  brand = CreditCardBrands.Undefined,
  expirationDate = { day: 31, month: 12, year: 2999 },
  last_4 = "4242",
  isDefault = false,
}): CreditCardProps {
  return {
    index,
    data: {
      stores: [
        {
          id,
        },
      ],
      default: defaultStatus,
      details: {
        brand,
        expirationDate,
        last_4,
      },
    },
    isDefault,
    setActiveCallback: mockActiveSetter,
    onSetDefaultRequested,
    onDeleteRequested,
  };
}

describe("CreditCardComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render", () => {
    render(<CreditCard {...makeCreditCard({})} />);
    expect(CreditCard).not.toBeNull();
  });

  test("should raise event when the radio button is pressed", () => {
    const index = 1;
    const { getByTestId } = render(
      <CreditCard {...makeCreditCard({ index })} />
    );
    fireEvent.click(
      getByTestId(`Saved__Payment__Radio__Credit__Card__${index}`)
    );
    expect(mockActiveSetter).toHaveBeenCalled();
  });

  test("should raise event when Make Default is pressed", () => {
    const index = 1;
    const { getByTestId } = render(
      <CreditCard
        {...makeCreditCard({ index, onSetDefaultRequested: mockDefaultSetter })}
      />
    );
    fireEvent.click(
      getByTestId(
        `Saved__Payment__Make__Default__Action__Credit__Card__${index}`
      )
    );
    expect(mockDefaultSetter).toHaveBeenCalled();
  });

  test("should not do anything when Make Default is pressed without callback", () => {
    const index = 5;
    const { getByTestId } = render(
      <CreditCard {...makeCreditCard({ index })} />
    );
    fireEvent.click(
      getByTestId(
        `Saved__Payment__Make__Default__Action__Credit__Card__${index}`
      )
    );
    expect(mockDefaultSetter).not.toHaveBeenCalled();
  });

  test("should show label instead of button if it is the default payment method", () => {
    const index = 1;
    const { getByTestId } = render(
      <CreditCard
        {...makeCreditCard({ index, defaultStatus: true, isDefault: true })}
      />
    );
    expect(
      getByTestId(`Saved__Payment__Default__Credit__Card__${index}`)
    ).toBeTruthy();
  });

  test("should raise event when delete button is pressed", () => {
    const index = 3;
    const { getByTestId } = render(
      <CreditCard
        {...makeCreditCard({ index, onDeleteRequested: mockDeleteSetter })}
      />
    );
    fireEvent.click(
      getByTestId(`Saved__Payment__Remove__Action__Credit__Card__${index}`)
    );
    expect(mockDeleteSetter).toHaveBeenCalled();
  });

  test("should not do anything when delete is pressed without callback", () => {
    const index = 5;
    const { getByTestId } = render(
      <CreditCard {...makeCreditCard({ index })} />
    );
    fireEvent.click(
      getByTestId(`Saved__Payment__Remove__Action__Credit__Card__${index}`)
    );
    expect(mockDeleteSetter).not.toHaveBeenCalled();
  });

  test("should set radio button as inactive if expired", () => {
    const index = 1;
    const { getByTestId } = render(
      <CreditCard
        {...makeCreditCard({
          index,
          expirationDate: {
            day: 31,
            month: 12,
            year: 2018,
          },
        })}
      />
    );
    expect(
      getByTestId(`Saved__Payment__Radio__Credit__Card__${index}`)
    ).toBeDisabled();
  });

  test("should not be expired if date is same as current date", () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1; //gives date as 1: January, 2: February...
    const { queryByTestId } = render(
      <CreditCard
        index={1}
        data={{
          stores: [
            {
              id: "ffff",
            },
          ],
          default: false,
          details: {
            brand: CreditCardBrands.Visa,
            expirationDate: {
              day: 0,
              month,
              year,
            },
            last_4: "4242",
          },
        }}
        isDefault={false}
        setActiveCallback={mockActiveSetter}
        onSetDefaultRequested={mockDefaultSetter}
        onDeleteRequested={mockDeleteSetter}
      />
    );

    expect(
      queryByTestId("Saved__Payment__Expired__Credit__Card__1")
    ).not.toBeInTheDocument();
  });

  test("should be expired if date is month is older but year is the same", () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth(); //gives previous month, since we index by 1 and getMonth indexes by 0

    const { queryByTestId } = render(
      <CreditCard
        index={1}
        data={{
          stores: [
            {
              id: "ffff",
            },
          ],
          default: false,
          details: {
            brand: CreditCardBrands.Visa,
            expirationDate: {
              day: 0,
              month,
              year,
            },
            last_4: "4242",
          },
        }}
        isDefault={false}
        setActiveCallback={mockActiveSetter}
        onSetDefaultRequested={mockDefaultSetter}
        onDeleteRequested={mockDeleteSetter}
      />
    );

    expect(
      queryByTestId("Saved__Payment__Expired__Credit__Card__1")
    ).toBeInTheDocument();
  });

  test("should have label as expired if date is older than current date", () => {
    const index = 1;
    const { getByTestId } = render(
      <CreditCard
        {...makeCreditCard({
          index,
          expirationDate: {
            day: 31,
            month: 12,
            year: 2018,
          },
        })}
      />
    );
    expect(
      getByTestId(`Saved__Payment__Expired__Credit__Card__${index}`)
    ).toBeTruthy();
  });

  test("should render with icons for all brands in STAR", () => {
    const brands = [
      CreditCardBrands.Visa,
      CreditCardBrands.MasterCard,
      CreditCardBrands.AmericanExpress,
      CreditCardBrands.Discover,
    ];

    brands.forEach((brand, index) => {
      const { getByTestId } = render(
        <CreditCard
          {...makeCreditCard({
            index,
            brand,
          })}
        />
      );
      expect(
        getByTestId(`Saved__Payment__Stripe__Icon__${index}`)
      ).toBeTruthy();
    });
  });

  test("should not render radio when displayRadio is set to false", () => {
    const context: WalletContextState = {
      displayRadio: false,
    };

    const index = 1;
    const { queryByTestId } = render(
      <CreditCard {...makeCreditCard({ index })} />,
      context
    );

    expect(
      queryByTestId(`Saved__Payment__Radio__Credit__Card__${index}`)
    ).not.toBeInTheDocument();
    expect(
      queryByTestId(`Saved__Payment__Text__Credit__Card__${index}`)
    ).toBeInTheDocument();
  });

  test("should render make default button based on displaySetDefault", () => {
    let context: WalletContextState = {
      displaySetDefault: false,
    };
    const index = 1;
    const { queryByTestId: query1 } = render(
      <CreditCard {...makeCreditCard({ index })} />,
      context
    );
    expect(
      query1(`Saved__Payment__Make__Default__Action__Credit__Card__${index}`)
    ).not.toBeInTheDocument();

    context = {
      displaySetDefault: true,
    };
    const { queryByTestId: query2 } = render(
      <CreditCard {...makeCreditCard({ index })} />,
      context
    );
    expect(
      query2(`Saved__Payment__Make__Default__Action__Credit__Card__${index}`)
    ).toBeInTheDocument();
  });

  test("should render delete button based on displayDelete", () => {
    let context: WalletContextState = {
      displayDelete: false,
    };
    const index = 1;
    const { queryByTestId: query1 } = render(
      <CreditCard {...makeCreditCard({ index })} />,
      context
    );
    expect(
      query1(`Saved__Payment__Remove__Action__Credit__Card__${index}`)
    ).not.toBeInTheDocument();

    context = {
      displayDelete: true,
    };
    const { queryByTestId: query2 } = render(
      <CreditCard {...makeCreditCard({ index })} />,
      context
    );
    expect(
      query2(`Saved__Payment__Remove__Action__Credit__Card__${index}`)
    ).toBeInTheDocument();
  });
});
