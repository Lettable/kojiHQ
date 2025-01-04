import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import Otp from "@/lib/model/Otp";

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
}

export async function POST(req) {
    await connectDB();

    try {
        const { requestedByEmail } = await req.json();

        if (!requestedByEmail) {
            return NextResponse.json(
                { success: false, message: "Email is required." },
                { status: 400 }
            );
        }

        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const recentOtp = await Otp.findOne({
            requestedByEmail,
            createdAt: { $gte: fifteenMinutesAgo },
        });

        if (recentOtp) {
            return NextResponse.json(
                { success: false, message: "You already requested an OTP within the last 15 minutes." },
                { status: 429 }
            );
        }

        const otp = generateOtp();

        const newOtp = new Otp({
            requestedByEmail,
            otp,
        });

        await newOtp.save();

        return NextResponse.json(
            { success: true, message: "OTP generated successfully.", otp },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error generating OTP:", error);

        return NextResponse.json(
            { success: false, message: "An error occurred while generating OTP." },
            { status: 500 }
        );
    }
}
