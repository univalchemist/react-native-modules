interface DeeplinkParam {
  name: string;
  required: boolean;
}

export interface Deeplink {
  label: string;
  value: string;
  params: DeeplinkParam[];
}

export const deeplinks: Deeplink[] = [
  {
    label: "Confirm Email Link",
    value: "confirmEmail",
    params: [{ name: "userId", required: true }],
  },
  {
    label: "Upload Pictures Link",
    value: "uploadPictures",
    params: [
      { name: "scenario", required: true },
      { name: "requestId", required: true },
    ],
  },
];
