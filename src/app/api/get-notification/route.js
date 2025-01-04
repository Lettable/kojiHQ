import { connectDB } from "@/lib/config/db";
import Notification from "@/lib/model/Notification";
import User from "@/lib/model/User.model";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();

    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const notifications = await Notification.find({ receiverId: userId })
            .populate("senderId", "username profilePic")
            .sort({ createdAt: -1 });

        await Notification.updateMany(
            { receiverId: userId, read: false },
            { $set: { read: true } }
        );

        return NextResponse.json({ success: true, data: notifications }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
