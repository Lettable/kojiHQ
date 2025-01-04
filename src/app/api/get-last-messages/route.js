// import { connectDB } from "@/lib/config/db";
// import P2PMessage from "@/lib/model/p2p";
// import User from "@/lib/model/User";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   await connectDB();

//   try {
//     const { userId } = await req.json();

//     if (!userId) {
//       return NextResponse.json(
//         { success: false, message: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     // Fetch the user's `intractedWith` array
//     const user = await User.findById(userId).select("intractedWith");

//     if (!user || !user.intractedWith.length) {
//       return NextResponse.json(
//         { success: false, message: "No interactions found for the user" },
//         { status: 404 }
//       );
//     }

//     // Extract the list of IDs from `intractedWith`
//     const intractedWithIds = user.intractedWith;

//     // Fetch all messages where the user is the sender or recipient and the other user is in `intractedWith`
//     const messages = await P2PMessage.find({
//       $or: [
//         { senderId: userId, recipientId: { $in: intractedWithIds } },
//         { recipientId: userId, senderId: { $in: intractedWithIds } },
//       ],
//     }).sort({ timestamp: -1 }); // Sort by latest message first

//     // Create a map to group messages by the other user (conversation ID)
//     const chatData = {};

//     for (const message of messages) {
//       // Determine the other user in the conversation
//       const otherUserId = message.senderId === userId ? message.recipientId : message.senderId;

//       // Fetch the other user's details if not already fetched
//       if (!chatData[otherUserId]) {
//         const otherUser = await User.findById(otherUserId).select("username profilePic");

//         chatData[otherUserId] = {
//           userId: otherUserId,
//           name: otherUser.username,
//           profilePic: otherUser.profilePic,
//           lastMessage: message.content,
//           timestamp: message.timestamp,
//           unread: 0, // Default unread count
//           parentId: message.parentId || null, // Add parentId if exists
//         };
//       }

//       // Update the last message and timestamp if the current message is more recent
//       if (new Date(message.timestamp) > new Date(chatData[otherUserId].timestamp)) {
//         chatData[otherUserId].lastMessage = message.content;
//         chatData[otherUserId].timestamp = message.timestamp;
//         chatData[otherUserId].parentId = message.parentId || null; // Ensure parentId is updated correctly
//       }

//       // Count unread messages for received messages
//       if (message.recipientId === userId && !message.read) {
//         chatData[otherUserId].unread += 1;
//       }
//     }

//     // Convert chatData to an array and sort by the latest timestamp
//     const chatList = Object.values(chatData).sort(
//       (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
//     );

//     return NextResponse.json({ success: true, data: chatList }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
//   }
// }

import { connectDB } from "@/lib/config/db";
import P2PMessage from "@/lib/model/p2p";
import User from "@/lib/model/User.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).select("intractedWith");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const intractedWithIds = user.intractedWith.filter(id => id.toString() !== userId);
    
    if (intractedWithIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "No interactions with other users" },
        { status: 404 }
      );
    }

    const messages = await P2PMessage.find({
      $or: [
        { senderId: userId, recipientId: { $in: intractedWithIds } },
        { recipientId: userId, senderId: { $in: intractedWithIds } },
      ],
    }).sort({ timestamp: -1 });

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { success: false, message: "No messages found" },
        { status: 404 }
      );
    }

    const otherUserIds = [
      ...new Set(messages.map(message => 
        message.senderId.toString() === userId 
          ? message.recipientId.toString() 
          : message.senderId.toString()
      ))
    ];

    const users = await User.find({ _id: { $in: otherUserIds } }).select("username profilePic statusEmoji");

    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = {
        name: user.username,
        profilePic: user.profilePic,
        statusEmoji: user.statusEmoji,
      };
      return acc;
    }, {});

    const chatData = {};

    messages.forEach(message => {
      const otherUserId = message.senderId.toString() === userId 
        ? message.recipientId.toString() 
        : message.senderId.toString();

      const otherUser = userMap[otherUserId] || { name: "Unknown", profilePic: null };

      if (!chatData[otherUserId]) {
        chatData[otherUserId] = {
          userId: otherUserId,
          name: otherUser.name,
          profilePic: otherUser.profilePic,
          statusEmoji: otherUser.statusEmoji,
          lastMessage: message.content,
          timestamp: message.timestamp,
          unread: 0,
          parentId: message.parentId || null,
        };
      }

      const currentTimestamp = new Date(message.timestamp);
      const existingTimestamp = new Date(chatData[otherUserId].timestamp);
      if (currentTimestamp > existingTimestamp) {
        chatData[otherUserId].lastMessage = message.content;
        chatData[otherUserId].timestamp = message.timestamp;
        chatData[otherUserId].parentId = message.parentId || null;
      }

      if (message.recipientId.toString() === userId && !message.read) {
        chatData[otherUserId].unread += 1;
      }
    });

    const chatList = Object.values(chatData).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    return NextResponse.json({ success: true, data: chatList }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);

    return NextResponse.json(
      { success: false, message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
