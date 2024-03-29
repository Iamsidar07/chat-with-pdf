import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db";
import UserModel from "@/models/User";
import { currentUser } from "@clerk/nextjs";

export const GET = async (req: NextRequest) => {
  try {
    await dbConnect();
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    const result = await UserModel.findOne({
      id: user.id,
    });

    if (!result) {
      const newUser = await new UserModel({
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
      });
      await newUser.save();
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: false, error: e }, { status: 500 });
  }
};
