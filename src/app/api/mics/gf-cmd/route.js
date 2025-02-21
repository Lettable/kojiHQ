import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';
import jwtDecode from 'jwt-decode';

export async function POST(req) {
  try {
    const { uid, am, to, tk } = await req.json();

    if (!uid || !am || !to || !tk) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const amount = Number(am);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
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

    const giver = await User.findOne({ userId: uid });
    if (!giver) {
      return NextResponse.json(
        { success: false, message: "Gifter user not found" },
        { status: 404 }
      );
    }

    if (giver.credits < amount) {
      return NextResponse.json(
        { success: false, message: "Not enough credits" },
        { status: 400 }
      );
    }

    const receiver = await User.findOne({ username: to });
    if (!receiver) {
      return NextResponse.json(
        { success: false, message: "Target user not found" },
        { status: 404 }
      );
    }

    giver.credits -= amount;
    receiver.credits += amount;

    await giver.save();
    await receiver.save();

    return NextResponse.json({
      success: true,
      message: "Gift transferred successfully",
    });
  } catch (error) {
    console.error("Gift API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
