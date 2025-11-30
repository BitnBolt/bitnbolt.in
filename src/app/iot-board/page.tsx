import IotBoardClient from './IotBoardClient';

export default function Page() {
  const productId = process.env.IOT_BOARD_PRODUCT_ID;
  return <IotBoardClient productId={productId} />;
}