// import { connectDB } from "@/lib/config/db";
// import Message from "@/lib/model/Message";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     await connectDB();
//     const { username, content, profilePic, userId } = await req.json();

//     if (!username || !content || !profilePic || !userId ) {
//         return NextResponse.json({ error: "Invalid input" }, { status: 400 });
//     }

//     const result = await Message.create({ username, content, profilePic, userId });

//     return NextResponse.json({ success: true, messageId: result._id }, { status: 201 });
// }


import connectRedis from "@/lib/config/redis";
import { NextResponse } from "next/server";

export async function POST(req) {
    const redis = connectRedis();
    const { username, content, profilePic, userId } = await req.json();

    if (!username || !content || !profilePic || !userId) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const message = { username, content, profilePic, userId, createdAt: new Date() };

    await redis.rpush('chat:messages', JSON.stringify(message));

    await redis.publish('chat:channel', JSON.stringify(message));

    return NextResponse.json({ success: true }, { status: 201 });
}