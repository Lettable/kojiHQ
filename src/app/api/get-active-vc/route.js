import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model";
import ActiveVoiceUser from "@/lib/model/Voice.model.js";
import { NextResponse } from "next/server";

/**
 * @description
 * Fetches all active users in a voice channel.
 *
 * @returns
 * 200: { success: boolean, activeUsers: User[] }
 * 500: { success: boolean, message: string, error: string }
 */

export async function GET(req) {
    await connectDB();

    try {
        const activeUsers = await ActiveVoiceUser.find({}, { _id: 0, userId: 1 });

        if (!activeUsers.length) {
            return NextResponse.json({ success: true, activeUsers: [] }, { status: 200 });
        }

        const userIds = activeUsers.map(user => user.userId);

        const users = await User.find(
            { _id: { $in: userIds } },
            { username: 1, profilePic: 1, statusEmoji: 1 }
        );

        return NextResponse.json({ success: true, activeUsers: users }, { status: 200 });

    } catch (error) {
        console.error("Error fetching active voice users:", error);
        return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
    }
}
