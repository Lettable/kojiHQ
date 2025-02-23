import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';
import { jwtDecode } from 'jwt-decode';

export async function POST(req) {
  try {
    const { uid, tk, t } = await req.json();
    if (!uid || !tk || !t) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    let decoded;
    try {
      decoded = jwtDecode(tk);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    if (decoded.userId !== uid) {
      return NextResponse.json(
        { success: false, message: "Unauthorized action" },
        { status: 403 }
      );
    }

    await connectDB();

    const adminUser = await User.findOne({ userId: uid });
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!adminUser.isAdmin) {
      return NextResponse.json(
        { success: false, message: "User is not admin" },
        { status: 403 }
      );
    }

    const targetUser = await User.findOne({
      username: { $regex: new RegExp(`^${t}$`, "i") },
    });
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "Target user not found" },
        { status: 404 }
      );
    }

    if (!targetUser.isBanned) {
      return NextResponse.json(
        { success: false, message: "User is not banned" },
        { status: 400 }
      );
    }

    targetUser.isBanned = false;
    await targetUser.save();

    return NextResponse.json({
      success: true,
      message: "User unbanned successfully",
    });
  } catch (error) {
    console.error("Unban user API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
} 