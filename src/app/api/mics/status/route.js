import { NextResponse } from "next/server";
import User from "@/lib/model/User.model";
import { connectDB } from "@/lib/config/db";

export async function POST(req) {
    const userId = req.nextUrl.searchParams.get('userId');

    try {
        await connectDB()
        const user = await User.findById(userId);
        const statusEmoji = user.statusEmoji || "";
        return NextResponse.json({ statusEmoji: statusEmoji }, { status: 200 });
    } catch (error) {
        console.error("Error getting status emoji:", error);
        return NextResponse.json(
            { error: "Failed to get status emoji" },
            { status: 500 }
        );
    }
    
}