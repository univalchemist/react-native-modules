import React from "react";
import { Form } from "./Form";

export const App = () => {
  return (
    <main className="h-full flex items-center">
      <div className="mx-auto my-6 w-11/12 md:w-9/12 lg:w-8/12 p-6 md:p-8 border-1 border-gray-300 rounded-2 flex flex-center justify-around">
        <Form />
      </div>
    </main>
  );
};

export default App;
