import { WalletMicroFrontend } from "@ftdr/react-native-wallet";
import React, { useRef, useState } from "react";
import { Button, SafeAreaView, ScrollView, View } from "react-native";
import { ACCESS_TOKEN } from "react-native-dotenv";
import tw from "twrnc";
import { Switch } from "./utils/Switch";

const App = () => {
  const walletRef = useRef(null);
  let lastDefault = undefined;
  let lastDelete = undefined;

  const [showDelete, setShowDelete] = useState(true);
  const [showSetDefault, setShowSetDefault] = useState(true);
  const [showRadio, setShowRadio] = useState(true);
  const [showAddCard, setShowAddCard] = useState(true);
  const [canDeleteDefault, setCanDeleteDefault] = useState(true);

  return (
    // TODO landscape flex row
    <SafeAreaView style={tw`flex-1 justify-center items-center`}>
      <ScrollView style={tw`w-full h-[50%]`}>
        <WalletMicroFrontend
          ref={walletRef}
          baseURL="https://test.apis.frontdoorhome.com"
          contractId={232806702}
          customerId={4325779}
          canDeleteDefault={canDeleteDefault}
          displayDelete={showDelete}
          displaySetDefault={showSetDefault}
          displayAddPaymentMethod={showAddCard}
          displayRadio={showRadio}
          token={ACCESS_TOKEN}
          addPaymentMethodPressedAction={(e) => console.log(e)}
          savedPaymentMethodSelectedCallback={(paymentMethod) => {
            console.log(paymentMethod);
          }}
          onSetDefaultRequested={(paymentMethod) => {
            lastDefault = paymentMethod;
            console.log("Requested default:", paymentMethod);
          }}
          onDeleteRequested={(paymentMethod) => {
            lastDelete = paymentMethod;
            console.log("Requested delete:", paymentMethod);
          }}
        />
      </ScrollView>

      {/* TODO add border top */}
      <ScrollView style={tw`w-full h-[50%]`} contentContainerStyle={tw`px-4`}>
        <View style={tw`flex justify-center mt-4`}>
          <Button
            title="Refresh"
            onPress={async () => {
              await walletRef?.current?.refreshPaymentMethodList();
            }}
          />
          <Button
            title="Clear Active Payment Method"
            onPress={() => {
              walletRef?.current?.setActivePaymentMethod();
            }}
          />
          <Button
            title="Set last press as default"
            onPress={() => {
              walletRef?.current?.setDefaultPaymentMethod(lastDefault);
            }}
          />
          <Button
            title="Delete last press"
            onPress={() => {
              walletRef?.current?.deletePaymentMethod(lastDelete);
            }}
          />
        </View>

        <View style={tw`flex justify-center mt-4`}>
          <Switch
            label="Display Delete Icon"
            style={tw`m-2`}
            on={showDelete}
            onChange={setShowDelete}
          />
          <Switch
            label="Display 'Show Default' Button"
            style={tw`m-2`}
            on={showSetDefault}
            onChange={setShowSetDefault}
          />
          <Switch
            label="Display Radio"
            style={tw`m-2`}
            on={showRadio}
            onChange={setShowRadio}
          />
          <Switch
            label="Allow deleting default"
            style={tw`m-2`}
            on={canDeleteDefault}
            onChange={setCanDeleteDefault}
          />
          <Switch
            label="Display Add Payment Method Menu"
            style={tw`m-2`}
            on={showAddCard}
            onChange={setShowAddCard}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
