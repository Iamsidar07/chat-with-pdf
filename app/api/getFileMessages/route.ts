import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db";
import MessageModel from "@/models/Message";
import { getAuth } from "@clerk/nextjs/server";
import FileModel from "@/models/File";

const INFINITE_QUERY_LIMIT = 5;
// /api/getFileMessages?pageNumber=1&fileId=somefileId&limit=3
export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const pageNumber = searchParams.get("pageNumber")
    ? Number(searchParams.get("pageNumber"))
    : 1;
  const fileId = searchParams.get("fileId");
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : INFINITE_QUERY_LIMIT;

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
    const messages = await MessageModel.find(
      {
        fileId,
        userId,
      },
      { createdAt: true, isUserMessage: true, text: true },
      { limit: limit, skip: (pageNumber - 1) * limit, sort: { createdAt: -1 } },
    );
    return NextResponse.json(messages, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
};
