import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { userId, groupName } = await req.json();

    // Validate input
    if (!userId || !groupName) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    try {
        await connectDB();

        // Update the user document to add the group
        const result = await User.updateOne(
            { _id: userId }, // Ensure you're using the correct field to match the user
            {
                $addToSet: { // Use $addToSet to avoid duplicates
                    groups: {
                        groupName,
                        assignedAt: new Date()
                    }
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "User  not found." }, { status: 404 });
        }

        return NextResponse.json({
            message: `Group '${groupName}' added to user '${userId}'.`,
            result
        }, { status: 200 });

    } catch (error) {
        console.error("Error adding group:", error);
        return NextResponse.json({ error: "An error occurred while adding the group." }, { status: 500 });
    }
}