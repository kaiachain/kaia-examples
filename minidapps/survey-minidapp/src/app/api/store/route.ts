import { NextRequest, NextResponse } from "next/server";

interface buyReq {
  buyerAddress: string;
  itemIdentifier: string;
  name: string;
  imageUrl: string;
  pgType: string;
  currencyCode: string;
  price: string;
  testMode: boolean;
}

const confirmUrl = (process.env.API_URL + "/api/store/callback") as string;
const lockUrl = (process.env.API_URL + "/api/store/callback") as string;
const unlockUrl = (process.env.API_URL + "/api/store/callback") as string;

export async function POST(req: NextRequest) {
  try {
    const data: buyReq = await req.json();
    const result = await fetch(
      "https://payment.dappportal.io/api/payment-v1/payment/create",
      {
        method: "POST",
        headers: {
          "X-Client-Id": process.env.DAPP_PORTAL_CLIENT_ID as string,
          "X-Client-Secret": process.env.PAYMENT_SECRET as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyerDappPortalAddress: data.buyerAddress,
          pgType: data.pgType,
          currencyCode: data.currencyCode,
          price: data.price,
          paymentStatusChangeCallbackUrl: confirmUrl,
          // lockUrl: lockUrl,
          // unlockUrl: unlockUrl,
          items: [
            {
              itemIdentifier: data.itemIdentifier,
              name: data.name,
              imageUrl: data.imageUrl,
              price: data.price,
              currencyCode: data.currencyCode,
            },
          ],
          testMode: data.testMode,
        }),
      }
    );
    const r = await result.json();
    const pId = r.id;
    return NextResponse.json({ pId }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Payment is failed" }, { status: 400 });
  }
}
