interface Params {
  formValue: Record<string, string>;
  deeplinkPrefix: string;
  deeplink: string;
}

export const generateLink = ({
  formValue,
  deeplinkPrefix,
  deeplink,
}: Params) => {
  const paramsKeys = Object.keys(formValue);
  const params = paramsKeys
    .map((param) => {
      if (formValue[param]) {
        return `${param}%253D${formValue[param]}`;
      }
    })
    .join("%26");
  return `${deeplinkPrefix}/?link=https://ahs.com/${deeplink}?${params}&apn=com.ahs.preview.showcase&ibi=com.ahs.preview.showcase`;
};
