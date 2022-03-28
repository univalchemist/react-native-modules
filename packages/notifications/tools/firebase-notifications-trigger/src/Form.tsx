import {
  Button,
  Input,
  TextArea,
  ProgressIndicatorOverlay,
} from "@ftdr/blueprint-components-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

interface FormState {
  title: string;
  body: string;
  fcmToken: string;
}

interface Props {
  firebaseKey: string;
}

const FIREBASE_API_ENDPOINT = "https://fcm.googleapis.com/fcm/send";

export const Form = ({ firebaseKey }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<FormState>();

  const onSubmit = async (data: FormState) => {
    setIsLoading(true);

    try {
      const body = {
        notification: {
          title: data.title,
          body: data.body,
        },
        to: data.fcmToken,
      };

      const response = await fetch(FIREBASE_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `key=${firebaseKey}`,
        },
        body: JSON.stringify(body),
      });

      console.log(response);
      // TODO display confirmation
    } catch (err) {
      // TODO handle error
    }

    setIsLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Notification title"
                placeholder="Enter optional title"
                onChange={(e) => onChange(e.target.value)}
                value={value}
                formField
              />
            )}
          />
        </div>

        <div className="mb-4">
          <Controller
            control={control}
            name="body"
            rules={{
              required: {
                message: "Notification text is required",
                value: true,
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextArea
                // TODO set min height
                label="Notification text"
                placeholder="Enter notification text"
                onChange={(e) => onChange(e.target.value)}
                value={value}
                formField
                required
                error={error?.message}
              />
            )}
          />
        </div>

        <div className="mb-4">
          <Controller
            control={control}
            name="fcmToken"
            rules={{
              required: {
                message: "FCM registration token is required",
                value: true,
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="FCM registration token"
                placeholder="Add an FCM registration token"
                onChange={(e) => onChange(e.target.value)}
                value={value}
                formField
                required
                error={error?.message}
              />
            )}
          />
        </div>

        <Button label="Send" size="medium" className="mt-2" type="submit" />
      </form>

      <ProgressIndicatorOverlay open={isLoading} />
    </>
  );
};
