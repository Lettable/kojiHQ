import Otp from "@/lib/model/Otp";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import sendOtpEmail from "@/lib/utils/SignUpOtp";
import User from "@/lib/model/User.model.js";

const OTP_EXPIRATION_TIME = 15 * 60 * 1000;

const generateOtp = async (email, purpose) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_TIME);

  await Otp.deleteMany({
    requestedByEmail: email,
    expiresAt: { $lte: new Date() },
  });

  const existingOtp = await Otp.findOne({
    requestedByEmail: email,
    expiresAt: { $gt: new Date() },
  });

  if (existingOtp) {
    console.log(`Reusing existing OTP for email: ${email}`);
    return existingOtp.otp;
  }

  const newOtp = new Otp({
    requestedByEmail: email,
    otp,
    expiresAt,
    purpose,
  });

  await newOtp.save();
  await sendOtpEmail(email, otp, purpose);

  return otp;
};

export async function POST(request) {
  try {
    await connectDB();

    const { email, purpose } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!purpose || !["sign-up", "password-reset"].includes(purpose)) {
      return NextResponse.json({ error: "Invalid or missing purpose" }, { status: 400 });
    }

    if (purpose === "sign-up") {
      const isExistingUser = await User.findOne({ email });
      if (isExistingUser) {
        return NextResponse.json(
          { message: "Email already registered" },
          { status: 400 }
        );
      }
    }

    await generateOtp(email, purpose);

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating OTP:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to generate OTP" },
      { status: 500 }
    );
  }
}
