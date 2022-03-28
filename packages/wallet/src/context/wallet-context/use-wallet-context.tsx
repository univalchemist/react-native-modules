import { createContext, useContext } from "react";

export type WalletContextState = {
  displayDelete?: boolean;
  displaySetDefault?: boolean;
  displayRadio?: boolean;
  displayAddPaymentMethod?: boolean;
  deleteDefault?: boolean;
};

export const walletContextInitialState: WalletContextState = {
  displayDelete: true,
  displaySetDefault: true,
  displayRadio: true,
  displayAddPaymentMethod: true,
  deleteDefault: true,
};

const WalletContext = createContext<WalletContextState>(
  walletContextInitialState
);

export const { Provider: WalletContextProvider } = WalletContext;

export const useWalletContext = (): WalletContextState =>
  useContext<WalletContextState>(WalletContext);
