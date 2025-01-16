import { NextResponse } from "next/server";
import Users from "@/lib/model/adUser.model.js";
import Forwarded from "@/lib/model/adForwarded.model.js";
import { connectDB } from "@/lib/config/db";

export async function GET(req) {
    try {
        const user_id = req.nextUrl.searchParams.get('id');

        if (!user_id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const user = await Users.findOne({ user_id: user_id });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const forwardData = await Forwarded.findOne({ user_id: user_id });
        const forwardedCount = forwardData ? forwardData.count : 0;

        return NextResponse.json({
            user_id: user.user_id,
            token: user.token || "No Token",
            is_running: user.is_running,
            credits: user.credits,
            totalAdsSent: forwardedCount
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
