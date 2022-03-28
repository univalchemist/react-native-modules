import { WalletJSClient } from "@ftdr/wallet-js-client";
import { act, renderHook } from "@testing-library/react-hooks";
import { PaymentMethod } from "../models";
import { CreditCardBrands } from "../models/credit-card";
import { getAllPaymentMethods, getDefaultPaymentMethod } from "../services";
import { useWalletComponent } from "./use-wallet-component";

const contractId = 1;
const customerId = 2;

const fakePaymentMethods: PaymentMethod[] = [
  {
    default: false,
    stores: [
      {
        id: "fake-id",
      },
    ],
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
];
const mockClient = {
  deletePaymentMethod: jest.fn(() => Promise.resolve({})),
  getDefaultPaymentMethod: jest.fn(() => Promise.resolve({})),
  getPaymentMethods: jest.fn(() => Promise.resolve(fakePaymentMethods)),
  updateDefaultPaymentMethod: jest.fn(() => Promise.resolve({})),
} as unknown as WalletJSClient;

jest.mock("../services/wallet-client-service", () => ({
  getAllPaymentMethods: jest.fn(
    (
      client: WalletJSClient,
      contractID: number | undefined,
      successCallback: (data: PaymentMethod[]) => void
    ) => {
      act(() => {
        client.getPaymentMethods({ contractID });
      });
      act(() => {
        successCallback(fakePaymentMethods);
      });
    }
  ),
  getDefaultPaymentMethod: jest.fn(),
}));

describe("useWalletComponent hook tests", () => {
  test("should return proper values from custom hook on mount", () => {
    const {
      result: {
        current: {
          getPaymentMethods,
          setActiveMethod,
          setSavedPayments,
          setDefaultMethod,
          activeMethod,
          defaultMethod,
          savedPayments,
        },
      },
    } = renderHook(() => useWalletComponent({ protobufClient: mockClient }));
    expect(getPaymentMethods).toBeInstanceOf(Function);
    expect(setSavedPayments).toBeInstanceOf(Function);
    expect(setDefaultMethod).toBeInstanceOf(Function);
    expect(setActiveMethod).toBeInstanceOf(Function);
    expect(activeMethod).toBeUndefined();
    expect(defaultMethod).toBeUndefined();
    expect(savedPayments).toEqual([]);
  });

  test("should getPaymentMethods call proper functions if contractId is not passed", async () => {
    const {
      result: {
        current: { getPaymentMethods },
      },
    } = renderHook(() => useWalletComponent({ protobufClient: mockClient }));
    expect(getPaymentMethods).toBeInstanceOf(Function);
    act(() => {
      getPaymentMethods({ contractId: undefined, customerId });
    });
    expect(getAllPaymentMethods).toHaveBeenCalledWith(
      mockClient,
      undefined,
      expect.any(Function),
      expect.any(Function),
      customerId
    );
    expect(getDefaultPaymentMethod).toHaveBeenCalledTimes(0);
  });

  test("should getPaymentMethods call proper functions", async () => {
    const {
      result: {
        current: { getPaymentMethods },
      },
    } = renderHook(() => useWalletComponent({ protobufClient: mockClient }));
    expect(getPaymentMethods).toBeInstanceOf(Function);
    act(() => {
      getPaymentMethods({ contractId, customerId });
    });
    expect(getAllPaymentMethods).toHaveBeenCalledWith(
      mockClient,
      contractId,
      expect.any(Function),
      expect.any(Function),
      customerId
    );
    expect(getDefaultPaymentMethod).toHaveBeenCalledWith(
      mockClient,
      contractId,
      expect.any(Function),
      expect.any(Function)
    );
  });

  test("should getPaymentMethods return proper data", async () => {
    const {
      result: {
        current: { getPaymentMethods },
      },
    } = renderHook(() => useWalletComponent({ protobufClient: mockClient }));
    expect(getPaymentMethods).toBeInstanceOf(Function);
    let result;
    await act(async () => {
      result = await getPaymentMethods({ contractId, customerId });
    });
    expect(result).toEqual(fakePaymentMethods);
  });
});
