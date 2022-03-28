import crashlytics from "@react-native-firebase/crashlytics";

export namespace CrashReporting {
  export const init = async (attributes: { [key: string]: string }) => {
    const { userId, ...restAttributes } = attributes;

    if (userId) {
      await crashlytics().setUserId(userId);
    }

    await crashlytics().setAttributes(restAttributes);
  };

  export const setAttribute = async (
    attribute: string,
    value: string | number
  ) => {
    await crashlytics().setAttribute(attribute, String(value));
  };

  export const raiseError = (native?: boolean) => {
    if (native) {
      crashlytics().crash();
    } else {
      throw new Error("CrashReporting: Raised error");
    }
  };

  export const disable = async () => {
    await crashlytics().setCrashlyticsCollectionEnabled(false);
  };

  export const enable = async () => {
    await crashlytics().setCrashlyticsCollectionEnabled(true);
  };

  export const getStatus = () => {
    return crashlytics().isCrashlyticsCollectionEnabled;
  };

  export const recordError = (
    error: Error,
    jsErrorName?: undefined | string
  ) => {
    crashlytics().recordError(error, jsErrorName);
  };

  export const log = (text: string) => {
    crashlytics().log(text);
  };
}
