import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';
import { jwtDecode } from 'jwt-decode';

export async function POST(req) {
  try {
    const { uid, tk, t } = await req.json();
    if (!uid || !tk || !t) {
      return NextResponse.json(
        { success: false, message: "Not Success" },
        { status: 400 }
      );
    }

    let decoded;
    try {
      decoded = jwtDecode(tk);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Bad tk" },
        { status: 401 }
      );
    }

    if (decoded.userId !== uid) {
      return NextResponse.json(
        { success: false, message: "Unauthorized nigga" },
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

    if (targetUser.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Cannot ban an admin" },
        { status: 403 }
      );
    }

    targetUser.isBanned = true;
    await targetUser.save();

    return NextResponse.json({
      success: true,
      message: "User banned successfully",
    });
  } catch (error) {
    console.error("Ban user API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
