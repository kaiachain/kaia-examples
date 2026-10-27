import { NextRequest, NextResponse } from "next/server";
import { joinGroup } from "../../../../hooks/backend/survey";
import { ethers } from "ethers";

interface JoinGroupData {
  id: string;
  commitment: bigint;
  signature: ethers.SignatureLike;
  idToken: string;
  account: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: JoinGroupData = await req.json();

    const receipt = await joinGroup(
      data.id,
      BigInt(data.commitment),
      data.signature,
      data.idToken,
      data.account
    );
    console.log(receipt);
    return NextResponse.json(
      { data: JSON.stringify(receipt) },
      { status: 200 }
    );
  } catch (e) {
    console.log(JSON.stringify(e));
    return NextResponse.json({ error: JSON.stringify(e) }, { status: 400 });
  }
}
