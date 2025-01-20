// import { connectDB } from "@/lib/config/db";
// import P2PMessage from "@/lib/model/p2p";
// import User from "@/lib/model/User";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     await connectDB();

//     try {
//         const { userId, recipientId } = await req.json();

//         // Validate input
//         if (!userId || !recipientId) {
//             return NextResponse.json(
//                 { success: false, message: "Both userId and recipientId are required" },
//                 { status: 400 }
//             );
//         }

//         // Find all messages between the two users, sorted by timestamp
//         const messages = await P2PMessage.find({
//             $or: [
//                 { senderId: userId, recipientId: recipientId },
//                 { senderId: recipientId, recipientId: userId },
//             ],
//         }).sort({ timestamp: 1 });

//         // Mark messages sent to the current user as read
//         await P2PMessage.updateMany(
//             { recipientId: userId, senderId: recipientId, read: false },
//             { $set: { read: true } }
//         );

//         // Enrich messages with sender details (username and profilePic)
//         const enrichedMessages = await Promise.all(
//             messages.map(async (message) => {
//                 const sender = await User.findById(message.senderId).select("username profilePic");
//                 return {
//                     _id: message._id,
//                     senderId: message.senderId,
//                     recipientId: message.recipientId,
//                     content: message.content,
//                     read: message.read,
//                     timestamp: message.timestamp,
//                     senderDetails: sender, // Add sender details
//                 };
//             })
//         );

//         return NextResponse.json({ success: true, data: enrichedMessages }, { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
//     }
// }


// import { connectDB } from "@/lib/config/db";
// import P2PMessage from "@/lib/model/p2p";
// import User from "@/lib/model/User";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     await connectDB();

//     try {
//         const { userId, recipientId } = await req.json();

//         // Validate input
//         if (!userId || !recipientId) {
//             return NextResponse.json(
//                 { success: false, message: "Both userId and recipientId are required" },
//                 { status: 400 }
//             );
//         }

//         // Find all messages between the two users, sorted by timestamp
//         const messages = await P2PMessage.find({
//             $or: [
//                 { senderId: userId, recipientId: recipientId },
//                 { senderId: recipientId, recipientId: userId },
//             ],
//         }).sort({ timestamp: 1 });

//         // Mark messages sent to the current user as read
//         await P2PMessage.updateMany(
//             { recipientId: userId, senderId: recipientId, read: false },
//             { $set: { read: true } }
//         );

//         // Enrich messages with sender details (username, profilePic) and parentId
//         const enrichedMessages = await Promise.all(
//             messages.map(async (message) => {
//                 const sender = await User.findById(message.senderId).select("username profilePic");
//                 return {
//                     _id: message._id,
//                     senderId: message.senderId,
//                     recipientId: message.recipientId,
//                     content: message.content,
//                     read: message.read,
//                     timestamp: message.timestamp,
//                     senderDetails: sender, // Add sender details
//                     parentId: message.parentId || null, // Include parentId if exists
//                 };
//             })
//         );

//         return NextResponse.json({ success: true, data: enrichedMessages }, { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
//     }
// }



import { connectDB } from "@/lib/config/db";
import P2PMessage from "@/lib/model/p2p";
import User from "@/lib/model/User.model";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();

    try {
        const { userId, recipientId } = await req.json();

        // Validate input
        if (!userId || !recipientId) {
            return NextResponse.json(
                { success: false, message: "Both userId and recipientId are required" },
                { status: 400 }
            );
        }

        // Find all messages between the two users, sorted by timestamp
        const messages = await P2PMessage.find({
            $or: [
                { senderId: userId, recipientId: recipientId },
                { senderId: recipientId, recipientId: userId },
            ],
        }).sort({ timestamp: 1 });

        // Mark messages sent to the current user as read
        await P2PMessage.updateMany(
            { recipientId: userId, senderId: recipientId, read: false },
            { $set: { read: true } }
        );

        // Enrich messages with sender details (username, profilePic), parentId and parent message content
        const enrichedMessages = await Promise.all(
            messages.map(async (message) => {
                const sender = await User.findById(message.senderId).select("username profilePic");

                // Fetch the parent message content if a parentId exists
                let parentMessageContent = null;
                if (message.parentId) {
                    const parentMessage = await P2PMessage.findById(message.parentId).select("content");
                    parentMessageContent = parentMessage ? parentMessage.content : null;
                }

                return {
                    _id: message._id,
                    senderId: message.senderId,
                    recipientId: message.recipientId,
                    content: message.content,
                    read: message.read,
                    timestamp: message.timestamp,
                    senderDetails: sender,
                    parentId: message.parentId || null, 
                    parentMessageContent, 
                };
            })
        );

        return NextResponse.json({ success: true, data: enrichedMessages }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
