import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // confirmed event
    /* validate event with your status of backend and update your status. You can make extra API to be called from frontend to check the confirmed status
    {
        "paymentId": "{payment_id}",
        "status": "STARTED|REGISTERED_ON_PG|CAPTURED_CONFIRMED_CONFIRM_FAILED|FINALIZED|CANCELED"
    }
    */

    // User item processing logic here
    console.log(data);

    return NextResponse.json(
      { message: "POST request received" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Payment is failed" }, { status: 400 });
  }
}
