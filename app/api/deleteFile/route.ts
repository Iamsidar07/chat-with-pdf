import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db";
import { getAuth } from "@clerk/nextjs/server";
import FileModel from "@/models/File";

export const DELETE = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  // TODO
  // set status code
  if (!id) {
    return NextResponse.json({ error: "Id is required" }, { status: 400 });
  }

  try {
    await dbConnect();
    const { userId } = getAuth(req);
    const file = await FileModel.findOne({
      userId,
      id,
    });
    if (!file)
      return NextResponse.json({ error: "Not Found" }, { status: 400 });
    await FileModel.deleteOne({ id });
    return NextResponse.json(file, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
};
