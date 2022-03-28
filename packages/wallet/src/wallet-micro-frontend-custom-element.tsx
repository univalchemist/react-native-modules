import { App } from "@ftdr/blueprint-components-react";
import React, { useCallback, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { enTextTemplates } from "./assets/i18n/en-text-templates";
import { WalletExposedApi, WalletMicroFrontend } from "./wallet-micro-frontend";

const WalletComponentBridge = ({ customElement }: any) => {
  const [cssLoaded, setCssLoaded] = useState(false);
  // const [refLoaded, setRefLoaded] = useState(false);
  const handleCssLoaded = useCallback(() => {
    setCssLoaded(true);
  }, []);

  const walletMfeRef = useRef<WalletExposedApi | null>(null);
  const dispatchEvent = useCallback(
    (eventName: string, data) => {
      customElement.dispatchEvent(
        new CustomEvent(eventName, {
          bubbles: true,
          detail: data,
        })
      );
    },
    [customElement]
  );
  const setRef = useCallback(
    (ref) => {
      // We need to wrap seting ref into useCallback
      walletMfeRef.current = ref;
      dispatchEvent("getClient", { ref });
    },
    [dispatchEvent]
  );

  return (
    <div>
      <link
        onLoad={handleCssLoaded}
        rel="stylesheet"
        href={customElement.getAttribute("cssurl") || ""}
      />
      <App
        appSettings={{
          language: "en_US",
          textTemplatesByLanguage: {
            en_US: enTextTemplates,
          },
        }}
      >
        {cssLoaded && (
          <WalletMicroFrontend
            ref={setRef}
            contractId={customElement.getAttribute("contractId") || ""}
            customerId={customElement.getAttribute("customerId") || ""}
            baseURL={customElement.getAttribute("baseurl") || ""}
            token={customElement.getAttribute("token") || undefined}
            tenant={customElement.getAttribute("tenant") || ""}
            sourceTypeCode={customElement.getAttribute("sourceTypeCode") || ""}
            displayDelete={
              customElement.getAttribute("displayDelete") || undefined
            }
            displaySetDefault={
              customElement.getAttribute("displaySetDefault") || undefined
            }
            displayRadio={customElement.getAttribute(
              "displayRadio" || undefined
            )}
            displayAddPaymentMethod={
              customElement.getAttribute("displayAddPaymentMethod") || undefined
            }
            canDeleteDefault={
              customElement.getAttribute("canDeleteDefault") || undefined
            }
          />
        )}
      </App>
    </div>
  );
};

export class WalletMicroFrontendCustomElement extends HTMLElement {
  // --- Custom Element Attributes to observe ---
  static get observedAttributes(): string[] {
    return [
      "baseurl",
      "token",
      "contractId",
      "customerId",
      "tenant",
      "sourceTypeCode",
      "canDeleteDefault",
    ];
  }

  // --- Custom Element Properties to expose ---
  set baseurl(value: string) {
    this.setAttribute("baseurl", value);
  }

  get baseurl(): string {
    return this.getAttribute("baseurl") || "";
  }

  set token(value: string) {
    this.setAttribute("token", value);
  }

  get token(): string {
    return this.getAttribute("token") || "";
  }

  set contractId(value: string) {
    this.setAttribute("contractId", value);
  }
  get contractId(): string {
    return this.getAttribute("contractId") || "";
  }

  set customerId(value: string) {
    this.setAttribute("customerId", value);
  }
  get customerId(): string {
    return this.getAttribute("customerId") || "";
  }

  set tenant(value: string) {
    this.setAttribute("tenant", value);
  }

  get tenant(): string {
    return this.getAttribute("tenant") || "";
  }

  set sourceTypeCode(value: string) {
    this.setAttribute("sourceTypeCode", value);
  }

  get sourceTypeCode(): string {
    return this.getAttribute("sourceTypeCode") || "";
  }

  set canDeleteDefault(value: boolean) {
    if (value) {
      this.setAttribute("canDeleteDefault", "");
    } else {
      this.removeAttribute("canDeleteDefault");
    }
  }

  get canDeleteDefault(): boolean {
    return this.hasAttribute("canDeleteDefault");
  }

  set displayDelete(value: boolean) {
    if (value) {
      this.setAttribute("displayDelete", "");
    } else {
      this.removeAttribute("displayDelete");
    }
  }

  get displayDelete(): boolean {
    return this.hasAttribute("displayDelete");
  }

  set displaySetDefault(value: boolean) {
    if (value) {
      this.setAttribute("displaySetDefault", "");
    } else {
      this.removeAttribute("displaySetDefault");
    }
  }

  get displaySetDefault(): boolean {
    return this.hasAttribute("displaySetDefault");
  }

  set displayRadio(value: boolean) {
    if (value) {
      this.setAttribute("displayRadio", "");
    } else {
      this.removeAttribute("displayRadio");
    }
  }

  get displayRadio(): boolean {
    return this.hasAttribute("displayRadio");
  }

  set displayAddPaymentMethod(value: boolean) {
    if (value) {
      this.setAttribute("displayAddPaymentMethod", "");
    } else {
      this.removeAttribute("displayAddPaymentMethod");
    }
  }

  get displayAddPaymentMethod(): boolean {
    return this.hasAttribute("displayAddPaymentMethod");
  }

  // --- A DOM Element where the React component will be mounted ---
  private mountPoint = document.createElement("div");

  constructor() {
    super();
    this.mountPoint.setAttribute("class", "root");
    this.mountPoint.id = "xxx";
    this.attachShadow({ mode: "open" }).appendChild(this.mountPoint);
  }

  // --- custom element lifecycle functions ---
  connectedCallback(): void {
    this.render();
  }

  disconnectedCallback(): void {
    ReactDOM.unmountComponentAtNode(this);
  }

  attributeChangedCallback(): void {
    this.render();
  }

  // --- custom element lifecycle functions ---

  render(): void {
    ReactDOM.unmountComponentAtNode(this);
    ReactDOM.render(
      <WalletComponentBridge customElement={this} />,
      this.mountPoint
    );
  }
}

customElements.define(
  "ftdr-wallet-micro-frontend",
  WalletMicroFrontendCustomElement
);
