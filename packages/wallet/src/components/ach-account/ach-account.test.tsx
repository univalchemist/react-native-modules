import { fireEvent, render as renderRaw } from "@testing-library/react";
import React from "react";
import {
  walletContextInitialState,
  WalletContextProvider,
  WalletContextState,
} from "../../context/wallet-context/use-wallet-context";
import { ACHAccount, ACHAccountProps } from "./ach-account";

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

function makeAchAccount({
  onSetDefaultRequested = undefined as jest.Mock | undefined,
  onDeleteRequested = undefined as jest.Mock | undefined,
  index = 1,
  id = "ffff",
  defaultStatus = false,
  account_number = "123412341234",
  routing_number = "4321",
  isDefault = false,
}): ACHAccountProps {
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
        account_number,
        routing_number,
      },
    },
    isDefault,
    setActiveCallback: mockActiveSetter,
    onSetDefaultRequested,
    onDeleteRequested,
  };
}

describe("AchAccountComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render", () => {
    render(<ACHAccount {...makeAchAccount({})} />);
    expect(ACHAccount).not.toBeNull();
  });

  test("should raise event when radio button is pressed", () => {
    const index = 1;
    const { getByTestId } = render(
      <ACHAccount {...makeAchAccount({ index })} />
    );
    fireEvent.click(getByTestId(`Saved__Payment__Radio__ACH__${index}`));
    expect(mockActiveSetter).toHaveBeenCalled();
  });

  test("should raise event when Make Default is pressed", () => {
    const index = 2;
    const { getByTestId } = render(
      <ACHAccount
        {...makeAchAccount({ index, onSetDefaultRequested: mockDefaultSetter })}
      />
    );
    fireEvent.click(
      getByTestId(`Saved__Payment__Make__Default__Action__ACH__${index}`)
    );
    expect(mockDefaultSetter).toHaveBeenCalled();
  });

  test("should not do anything when Make Default is pressed without callback", () => {
    const index = 5;
    const { getByTestId } = render(
      <ACHAccount {...makeAchAccount({ index })} />
    );
    fireEvent.click(
      getByTestId(`Saved__Payment__Make__Default__Action__ACH__${index}`)
    );
    expect(mockDefaultSetter).not.toHaveBeenCalled();
  });

  test("should show label instead of button if it is the default payment method", () => {
    const component = render(
      <ACHAccount
        {...makeAchAccount({ defaultStatus: true, isDefault: true })}
      />
    );
    return component.findByText("Default").then((result) => {
      expect(result).toBeTruthy();
    });
  });

  test("should raise event when delete button is pressed", () => {
    const index = 3;
    const { getByTestId } = render(
      <ACHAccount
        {...makeAchAccount({ index, onDeleteRequested: mockDeleteSetter })}
      />
    );
    fireEvent.click(
      getByTestId(`Saved__Payment__Remove__Action__ACH__${index}`)
    );
    expect(mockDeleteSetter).toHaveBeenCalled();
  });

  test("should not do anything when delete is pressed without callback", () => {
    const index = 5;
    const { getByTestId } = render(
      <ACHAccount {...makeAchAccount({ index })} />
    );
    fireEvent.click(
      getByTestId(`Saved__Payment__Remove__Action__ACH__${index}`)
    );
    expect(mockDeleteSetter).not.toHaveBeenCalled();
  });

  test("should not render radio when displayRadio is set to false", () => {
    const context: WalletContextState = {
      displayRadio: false,
    };

    const index = 1;
    const { queryByTestId } = render(
      <ACHAccount {...makeAchAccount({ index })} />,
      context
    );

    expect(
      queryByTestId(`Saved__Payment__Radio__ACH__${index}`)
    ).not.toBeInTheDocument();
    expect(
      queryByTestId(`Saved__Payment__Text__ACH__${index}`)
    ).toBeInTheDocument();
  });

  test("should render make default button based on displaySetDefault", () => {
    let context: WalletContextState = {
      displaySetDefault: false,
    };
    const index = 1;
    const { queryByTestId: query1 } = render(
      <ACHAccount {...makeAchAccount({ index })} />,
      context
    );
    expect(
      query1(`Saved__Payment__Make__Default__Action__ACH__${index}`)
    ).not.toBeInTheDocument();

    context = {
      displaySetDefault: true,
    };
    const { queryByTestId: query2 } = render(
      <ACHAccount {...makeAchAccount({ index })} />,
      context
    );
    expect(
      query2(`Saved__Payment__Make__Default__Action__ACH__${index}`)
    ).toBeInTheDocument();
  });

  test("should render delete button based on displayDelete", () => {
    let context: WalletContextState = {
      displayDelete: false,
    };
    const index = 1;
    const { queryByTestId: query1 } = render(
      <ACHAccount {...makeAchAccount({ index })} />,
      context
    );
    expect(
      query1(`Saved__Payment__Remove__Action__ACH__${index}`)
    ).not.toBeInTheDocument();

    context = {
      displayDelete: true,
    };
    const { queryByTestId: query2 } = render(
      <ACHAccount {...makeAchAccount({ index })} />,
      context
    );
    expect(
      query2(`Saved__Payment__Remove__Action__ACH__${index}`)
    ).toBeInTheDocument();
  });
});
