import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const blockedUserIds = user.blockedUsers || [];

    const blockedUsers = await User.find({ _id: { $in: blockedUserIds } }).select(
      "username profilePic _id"
    );

    return NextResponse.json({
      success: true,
      message: "Blocked users fetched successfully",
      blockedUsers,
    });
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
