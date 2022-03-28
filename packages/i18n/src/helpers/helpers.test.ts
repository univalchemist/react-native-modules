import { Resource } from "i18next";
import { getLocaleLanguageCode, retrieveLanguagesList } from "./helpers";

describe("helpers: retrieveLanguagesList", () => {
  it("should return empty array if incorrect parameter provided", () => {
    expect(retrieveLanguagesList(undefined)).toEqual([]);
    expect(retrieveLanguagesList(null)).toEqual([]);
    expect(retrieveLanguagesList({})).toEqual([]);
  });

  it("should return languages list if Resource object provided", () => {
    const mockedObject = {
      "en-PL": {},
      "en-ES": {},
      "es": {},
    } as Resource;

    const result = retrieveLanguagesList(mockedObject);
    expect(result).toEqual(["en-PL", "en-ES", "es"]);
  });
});

describe("helpers: getLocaleLanguageCode", () => {
  it("should return 'en' if wrong parameter provided", () => {
    expect(getLocaleLanguageCode(undefined)).toEqual("en");
    expect(getLocaleLanguageCode(null)).toEqual("en");
    expect(getLocaleLanguageCode("")).toEqual("en");
  });

  it("should return two-character language code if correct parameter provided", () => {
    expect(getLocaleLanguageCode("dummy_value")).toEqual("du");
    expect(getLocaleLanguageCode("en-PL")).toEqual("en");
    expect(getLocaleLanguageCode("es-BR")).toEqual("es");
  });
});
