import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import Message from "@/lib/model/Message";
import { jwtDecode } from "jwt-decode";

export async function POST(req) {
    try {
        const { u, c, t } = await req.json();

        if (!u || !c || !t) {
            return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
        }

        // Decode JWT
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

        const message = await Message.findOne({ userId: u, content: c }).sort({ createdAt: -1 });

        if (!message) {
            return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
        }

        if (message.userId !== u) {
            return NextResponse.json({ success: false, message: "Unauthorized action" }, { status: 403 });
        }

        await Message.deleteOne({ _id: message._id });

        return NextResponse.json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.error("Delete Message Error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
