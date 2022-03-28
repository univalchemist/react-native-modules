import { App } from "@ftdr/blueprint-components-react";
import { render } from "@testing-library/react";
import React from "react";
import "../../tests/matchMedia.mock";
import { WalletEmptyView } from "./empty-mfe-view";

describe("EmptyMfeView", () => {
  test("should render", () => {
    render(
      <App>
        <WalletEmptyView />
      </App>
    );
    expect(WalletEmptyView).not.toBeNull();
  });
});
