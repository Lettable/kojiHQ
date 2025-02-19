import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import Message from "@/lib/model/Message";
import { jwtDecode } from "jwt-decode";

export async function POST(req) {
    try {
        const { u, c, t, tz } = await req.json();

        if (!u || !c || !t || !tz) {
            return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
        }

        let decoded;
        try {
            decoded = jwtDecode(t);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
        }

        if (!decoded.userId || decoded.userId !== u) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        await connectDB();
        const message = await Message.findOne({ userId: u, createdAt: new Date(tz) });

        if (!message) {
            return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
        }

        if (message.userId !== u) {
            return NextResponse.json({ success: false, message: "Unauthorized action" }, { status: 403 });
        }

        message.content = c;
        message.updatedAt = new Date();
        await message.save();

        return NextResponse.json({ success: true, message: "Message updated successfully" });
    } catch (error) {
        console.error("Edit Message Error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
