import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();

    try {
        const { username } = await req.json();

        if (!username) {
            return NextResponse.json({ success: false, message: "Username parameter is required" }, { status: 400 });
        }

        const users = await User.find({
            username: { $regex: username, $options: "i" }
        }).select("id username profilePic statusEmoji usernameEffect");

        if (users.length === 0) {
            return NextResponse.json({ success: false, message: "No users found" }, { status: 404 });
        }

        const userData = users.map(user => ({
            id: user._id,
            username: user.username,
            profilePic: user.profilePic || "",
            statusEmoji: user.statusEmoji || false,
            usernameEffect: user.usernameEffect || "regular-effect"
        }));

        return NextResponse.json({ success: true, data: userData }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
