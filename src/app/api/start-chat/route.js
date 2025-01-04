import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();

    try {
        const { starterId, recipientId } = await req.json();

        // Validate input
        if (!starterId || !recipientId) {
            return NextResponse.json(
                { success: false, message: "Both starterId and recipientId are required" },
                { status: 400 }
            );
        }

        // Ensure starter and recipient users are not the same
        if (starterId === recipientId) {
            return NextResponse.json(
                { success: false, message: "Cannot start a chat with yourself" },
                { status: 400 }
            );
        }

        // Find both users
        const starterUser = await User.findById(starterId);
        const recipientUser = await User.findById(recipientId);

        if (!starterUser || !recipientUser) {
            return NextResponse.json(
                { success: false, message: "One or both users not found" },
                { status: 404 }
            );
        }

        // Add recipientId to starter's `intractedWith` if not already there
        if (!starterUser.intractedWith.includes(recipientId)) {
            starterUser.intractedWith.push(recipientId);
            await starterUser.save();
        }

        // Add starterId to recipient's `intractedWith` if not already there
        if (!recipientUser.intractedWith.includes(starterId)) {
            recipientUser.intractedWith.push(starterId);
            await recipientUser.save();
        }

        return NextResponse.json(
            { success: true, message: "Chat interaction recorded successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
