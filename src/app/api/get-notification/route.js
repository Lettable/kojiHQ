// import { connectDB } from "@/lib/config/db";
// import Notification from "@/lib/model/Notification";
// import User from "@/lib/model/User.model";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     await connectDB();

//     try {
//         const { userId } = await req.json();

//         if (!userId) {
//             return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
//         }

//         const notifications = await Notification.find({ receiverId: userId })
//             .populate("senderId", "username profilePic")
//             .sort({ createdAt: -1 });

//         await Notification.updateMany(
//             { receiverId: userId, read: false },
//             { $set: { read: true } }
//         );

//         return NextResponse.json({ success: true, data: notifications }, { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
//     }
// }


import { connectDB } from "@/lib/config/db";
import Notification from "@/lib/model/Notification";
import User from "@/lib/model/User.model";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();

    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const notifications = await Notification.find({ receiverId: userId })
            .sort({ createdAt: -1 });

        const senderIds = [...new Set(notifications.map(notification => notification.senderId))];

        const users = await User.find({ _id: { $in: senderIds } }).select("username profilePic");

        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = user;
        });

        const formattedNotifications = notifications.map(notification => {
            const sender = userMap[notification.senderId];
            return {
                ...notification.toObject(),
                sender: {
                    username: sender ? sender.username : 'Unknown', 
                    profilePic: sender ? sender.profilePic : null
                }
            };
        });

        await Notification.updateMany(
            { receiverId: userId, read: false },
            { $set: { read: true } }
        );

        return NextResponse.json({ success: true, data: formattedNotifications }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}