import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db";
import { getAuth } from "@clerk/nextjs/server";

import FileModel from "@/models/File";
export const GET = async (req: NextRequest) => {
  try {
    await dbConnect();
    const { userId } = getAuth(req);
    const files = await FileModel.find({
      userId,
    }).sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, results: files },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ success: false, error: e }, { status: 500 });
  }
};
