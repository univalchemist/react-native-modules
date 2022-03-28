import { Text, useAppContext } from "@ftdr/blueprint-components-react";
import React from "react";

export const WalletEmptyView: React.FC = () => {
  const {
    appSettings: { localizedText },
  } = useAppContext();

  return (
    <div
      className="
          border-solid border-1 border-gray-300 
          rounded-3 my-1 text-center p-4
        "
    >
      <Text color="gray" className="m-2 p-2">
        {localizedText("NO_PAYMENT_METHOD")}
      </Text>
    </div>
  );
};
