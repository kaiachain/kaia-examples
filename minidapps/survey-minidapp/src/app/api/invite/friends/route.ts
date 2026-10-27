import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { isValidToken } from "../../../../hooks/backend/survey";

interface Friends {
  encodedUID: string;
  idToken: string;
}

const lineUidRegex = /^U[a-z0-9]{32}$/;

export async function POST(req: NextRequest) {
  try {
    const body: Friends = await req.json();

    const profile = await isValidToken(body.idToken);
    const uid = jwt.verify(
      body.encodedUID,
      process.env.INVITE_SECRET as string
    );

    // passing only format check is enough, skipping the validation of uid because it's already verified when encoding
    if (lineUidRegex.test(uid as string)) {
      /*
       * The user is invited by friends, do something here for reward
       * e.g. mapping the uid with profile.userId to reward uid(inviter) when the profile.userId(invitee) accomplishes some tasks
       */
      const msg = `User ${profile.userId} is invited by ${uid}`;
      console.log(msg);
      return NextResponse.json({ status: 200 });
    } else {
      return NextResponse.json({ error: "invalid uid" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "invalid uid" }, { status: 400 });
  }
}
