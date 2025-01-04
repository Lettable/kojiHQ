import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Otp from "@/lib/model/Otp";
import User from "@/lib/model/User.model";
import { connectDB } from "@/lib/config/db";

export async function POST(request) {
  try {
    await connectDB();

    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, OTP, and new password are required" },
        { status: 400 }
      );
    }
    
    const otpRecord = await Otp.findOne({ requestedByEmail: email, purpose: "password-reset" });
    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    if (String(otpRecord.otp) !== String(otp)) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { passwordHash: hashedPassword });

    await Otp.deleteOne({ _id: otpRecord._id });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
