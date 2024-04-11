import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db";
import MessageModel from "@/models/Message";
import { getAuth } from "@clerk/nextjs/server";
import FileModel from "@/models/File";
const INFINITE_QUERY_LIMIT = 10;
// /api/getFileMessages?pageNumber=1&fileId=somefileId&limit=3
export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const pageNum = searchParams.get("pageNum")
    ? Number(searchParams.get("pageNum"))
    : 0;
  const fileId = searchParams.get("fileId");
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : INFINITE_QUERY_LIMIT;
  const offset = (pageNum - 1) * limit;

  if (!fileId) {
    return NextResponse.json({ error: "FileId is required" }, { status: 400 });
  }
  try {
    await dbConnect();
    const { userId } = getAuth(req);
    const file = await FileModel.findOne({
      _id: fileId,
      userId,
    });
    if (!file)
      return NextResponse.json({ error: "Not Found" }, { status: 400 });
    const countMessages = await MessageModel.countDocuments();
    const messages = await MessageModel.find({
      fileId,
      userId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    let hasMore = offset + messages.length < countMessages;

    return NextResponse.json({ messages, hasMore }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
};
