import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model";
import { NextResponse } from "next/server";

export async function POST(req) {
    const userId = req.nextUrl.searchParams.get('userId');

  try {
    await connectDB();

    const { signature } = await req.json();

    if (!signature) {
      return NextResponse.json(
        { error: "Signature is required" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { signature } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Signature updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating signature:", error);
    return NextResponse.json(
      { error: "Failed to update signature" },
      { status: 500 }
    );
  }
}
