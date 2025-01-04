import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { userId, recipientId, action } = await req.json();

    if (!userId || !recipientId || !action) {
      return NextResponse.json(
        { success: false, message: "userId, recipientId, and action are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (!user.blockedUsers) {
      user.blockedUsers = [];
    }

    const recipient = await User.findById(recipientId);

    if (!recipient) {
      return NextResponse.json({ success: false, message: "Recipient not found" }, { status: 404 });
    }

    if (!["block", "unblock"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action. Use 'block' or 'unblock'." },
        { status: 400 }
      );
    }

    // Block logic
    if (action === "block") {
      if (!user.blockedUsers.includes(recipientId)) {
        user.blockedUsers.push(recipientId);
      }

      recipient.intractedWith = recipient.intractedWith.filter((id) => id.toString() !== userId);
    } 
    else if (action === "unblock") {
      user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== recipientId);

      if (!recipient.intractedWith.includes(userId)) {
        recipient.intractedWith.push(userId);
      }
    }

    await user.save();

    await recipient.save();

    return NextResponse.json({
      success: true,
      message: `User has been successfully ${action}ed.`,
      blockedUsers: user.blockedUsers,
    });
  } catch (error) {
    console.error("Error in blocking/unblocking:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
