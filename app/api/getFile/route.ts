import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db";
import { getAuth } from "@clerk/nextjs/server";
import FileModel from "@/models/File";
// /api/getFile?key=someKey
export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Key is required" }, { status: 400 });
  }
  try {
    await dbConnect();
    const { userId } = getAuth(req);
    const file = await FileModel.findOne({
      userId,
      key,
    });
    return NextResponse.json({ success: true, file }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ success: false, error: e }, { status: 500 });
  }
};
