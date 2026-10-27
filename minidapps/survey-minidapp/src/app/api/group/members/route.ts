import { NextRequest, NextResponse } from "next/server";
import { getGroupId, getGroupMembers } from "../../../../hooks/backend/survey";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      throw Error("Invalid contract address");
    }
    const groupId = await getGroupId(id);
    const members = await getGroupMembers(groupId);

    return NextResponse.json(
      { data: JSON.stringify({ members, groupId }) },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: JSON.stringify(e) }, { status: 400 });
  }
}
