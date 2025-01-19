// import { connectDB } from "@/lib/config/db";
// import Message from "@/lib/model/Message";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await connectDB();

//     const messages = await Message.find().sort({ createdAt: 1 }).exec();

//     return new NextResponse(
//       JSON.stringify({ messages }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Internal Server Error" }),
//       { status: 500 }
//     );
//   }
// }

// import { connectDB } from "@/lib/config/db";
// import Message from "@/lib/model/Message";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await connectDB();

//     // Fetch the latest 30 messages sorted by createdAt in descending order (newest first)
//     const messages = await Message.find()
//       .sort({ createdAt: -1 }) // Sort by createdAt descending to get the latest messages first
//       .limit(30) // Limit to the latest 30 messages
//       .exec();

//     // Reverse the array to send them in ascending order (oldest to newest)
//     const sortedMessages = messages.reverse();

//     // Format the response as required
//     // const formattedMessages = sortedMessages.map((message) => ({
//     //   _id: { $oid: message._id.toString() },
//     //   username: message.username,
//     //   content: message.content,
//     //   profilePic: message.profilePic,
//     //   userId: message.userId,
//     //   createdAt: { $date: message.createdAt.toISOString() },
//     //   updatedAt: { $date: message.updatedAt.toISOString() },
//     //   __v: message.__v,
//     // }));

//     return new NextResponse(
//       JSON.stringify({ messages: sortedMessages }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Internal Server Error" }),
//       { status: 500 }
//     );
//   }
// }


// import connectRedis from "@/lib/config/redis";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const redis = connectRedis();
//   try {
//     const messages = await redis.lrange('chat:messages', 0, -1);
//     const parsedMessages = messages.map(msg => JSON.parse(msg));

//     return new NextResponse(
//       JSON.stringify({ messages: parsedMessages }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Internal Server Error" }),
//       { status: 500 }
//     );
//   }
// }



import { connectDB } from "@/lib/config/db";
import Message from "@/lib/model/Message";
import User from "@/lib/model/User.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const formatedMessages = messages.reverse();
    const updatedMessages = await Promise.all(
      formatedMessages.map(async (message) => {
        const user = await User.findById(message.userId).lean();
        return {
          _id: message._id,
          content: message.content,
          userId: message.userId,
          usernameEffect: user.usernameEffect ? user.usernameEffect : "regular-effect",
          username: user?.username || "Unknown User",
          profilePic: user?.profilePic || null,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        };
      })
    );

    return new NextResponse(
      JSON.stringify({ messages: updatedMessages }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
