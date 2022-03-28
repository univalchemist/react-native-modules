import { useState } from "react";
import { Dialog, Input, Text } from "@ftdr/blueprint-components-react";
import { Form } from "./Form";

export const App = () => {
  const [isOpenModal, setIsOpenModal] = useState(true);

  const [firebaseKey, setFirebaseKey] = useState("");

  return (
    <main className="h-full flex items-center">
      <div className="mx-auto my-6 w-11/12 md:w-9/12 lg:w-5/12 p-6 md:p-8 border-1 border-gray-300 rounded-2">
        <Dialog open={isOpenModal} modal hideClose>
          <Input
            label="Firebase key"
            placeholder="Firebase key"
            onChange={(e) => setFirebaseKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && firebaseKey) {
                setIsOpenModal(false);
              }
            }}
          />
        </Dialog>

        <Text variant="heading-03" className="mb-6" as="h1">
          Notifications Trigger
        </Text>

        <Form firebaseKey={firebaseKey} />
      </div>
    </main>
  );
};
