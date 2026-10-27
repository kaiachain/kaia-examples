import { NextRequest, NextResponse } from "next/server";

interface finalizeReq {
  id: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: finalizeReq = await req.json();
    const result = await fetch(
      "https://payment.dappportal.io/api/payment-v1/payment/finalize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.id,
        }),
      }
    );
    return NextResponse.json(
      { message: "Finalization is done" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Finalization is failed" },
      { status: 400 }
    );
  }
}
