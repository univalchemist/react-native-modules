import React, { useEffect, useState } from "react";
import { Button, Input, Select } from "@ftdr/blueprint-components-react";
import { deeplinks } from "./assets";
import { Deeplink } from "./assets/deeplinks";
import { generateLink } from "./utils";

export const Form = () => {
  const [deeplinkPrefix, setDeeplinkPrefix] = useState(
    "https://ahsshowcase.page.link"
  );
  const [selectedDeeplink, setSelectedDeeplink] = useState<Deeplink | null>(
    null
  );
  const [formValue, setFormValue] = useState<Record<string, string>>({});
  const [generatedUrl, setGeneratedUrl] = useState("");

  const handleDeeplinkChange = (deeplink: Deeplink) => {
    setSelectedDeeplink(deeplink);
  };

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormValue((prevState) => ({ ...prevState, [field]: e.target.value }));
  };

  const handleDeeplinkPrefixChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDeeplinkPrefix(e.target.value);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const link = generateLink({
      formValue,
      deeplinkPrefix,
      deeplink: selectedDeeplink?.value as string,
    });

    setGeneratedUrl(link);
  };

  const renderPreview = () => {
    const paramsKeys = Object.keys(formValue);

    return (
      <div>
        <p>Preview</p>
        <div className="border-2 border-slate-50 p-4">
          {"{"}
          {paramsKeys.map((param, i) => (
            <p className="ml-3" key={i}>
              {param}: <b>{formValue[param]}</b>
            </p>
          ))}
          {"}"}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (selectedDeeplink) {
      const initialFormValue = selectedDeeplink.params.map((param) => [
        param.name,
        "",
      ]);
      setFormValue(Object.fromEntries(initialFormValue));
    }
  }, [selectedDeeplink]);

  return (
    <>
      <div className="w-1/2">
        <h1 className="mb-3 font-bold">Generate deeplink</h1>
        <Input
          className="mb-3"
          value={deeplinkPrefix}
          onChange={handleDeeplinkPrefixChange}
          label="Deeplink URL first part"
          placeholder="Deeplink URL first part"
          formField
          required
        />
        <Select
          className="mb-3"
          options={deeplinks}
          onSelect={(deeplink) => handleDeeplinkChange(deeplink as Deeplink)}
          label="Select deeplink"
          formField
        />
        <form onSubmit={onSubmit}>
          {selectedDeeplink?.params.map((param, i) => (
            <Input
              key={i}
              label={param.name}
              placeholder={`Enter ${param.name}`}
              value={formValue[param.name]}
              onChange={handleInputChange(param.name)}
              formField
              required={param.required}
            />
          ))}
          <Button
            label="Generate link"
            size="medium"
            className="mt-2"
            type="submit"
          />
        </form>
        <p className="mt-5">{generatedUrl}</p>
      </div>
      {renderPreview()}
    </>
  );
};
