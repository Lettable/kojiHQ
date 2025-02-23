import { connectDB } from "@/lib/config/db";
import Notification from "@/lib/model/Notification";
import User from "@/lib/model/User.model";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();

  try {
    const { userId, tk } = await req.json();

    if (!userId || !tk) {
      return NextResponse.json(
        { success: false, message: "User ID and token are required" },
        { status: 400 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(tk, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    if (decoded.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const notifications = await Notification.find({ receiverId: userId }).sort({
      createdAt: -1,
    });

    const senderIds = [
      ...new Set(notifications.map((notification) => notification.senderId.toString())),
    ];
    const users = await User.find({ _id: { $in: senderIds } }).select("username profilePic");

    const userMap = {};
    users.forEach((user) => {
      userMap[user._id.toString()] = user;
    });

    const groupedNotifications = notifications.reduce((acc, notification) => {
      const type = notification.type;
      const sender = userMap[notification.senderId.toString()] || {
        username: "Unknown",
        profilePic: null,
      };

      const formattedNotification = {
        ...notification.toObject(),
        sender: {
          username: sender.username,
          profilePic: sender.profilePic,
        },
      };

      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(formattedNotification);
      return acc;
    }, {});

    await Notification.updateMany(
      { receiverId: userId, readed: false },
      { $set: { readed: true } }
    );

    return NextResponse.json(
      { success: true, data: groupedNotifications },
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
