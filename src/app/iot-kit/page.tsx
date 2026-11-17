import IotKitLanding from './IotKitLanding';

export default function Page() {
  const formUrl = process.env.NEXT_PUBLIC_IOT_KIT_FORM_URL;
  return (
    <IotKitLanding
      productHref="/product/iot-board"
      formUrl={formUrl || undefined}
    />
  );
}
