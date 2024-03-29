import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db";
import { getAuth } from "@clerk/nextjs/server";
import FileModel from "@/models/File";
// /api/getFile?key=someKey
export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const fileId = searchParams.get("fileId");
  // TODO
  // set status code
  if (!fileId) {
    return NextResponse.json({ error: "fileId is required" }, { status: 400 });
  }
  try {
    await dbConnect();
    const { userId } = getAuth(req);
    const file = await FileModel.findOne({
      userId,
      id: fileId,
    });
    if (!file) return NextResponse.json({ status: "PENDING" });
    return NextResponse.json({ status: file.uploadStatus }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
};
