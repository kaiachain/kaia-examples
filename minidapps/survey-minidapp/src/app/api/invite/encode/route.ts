import { NextRequest, NextResponse } from "next/server";
import { isValidToken } from "../../../../hooks/backend/survey";
import jwt from "jsonwebtoken";

interface InviteBody {
  idToken: string;
}

export async function POST(req: NextRequest) {
  const body: InviteBody = await req.json();
  let profile, encodedUID;
  try {
    profile = await isValidToken(body.idToken);
  } catch (error) {
    return NextResponse.json({ error: "token check error" }, { status: 400 });
  }

  try {
    encodedUID = jwt.sign(profile.userId, process.env.INVITE_SECRET as string); // won't be expired
  } catch (error) {
    return NextResponse.json({ error: "sign error" }, { status: 400 });
  }
  return NextResponse.json({ encodedUID }, { status: 200 });
}
