import { NextResponse } from 'next/server';
import Message from "@/lib/model/Message";

export async function GET() {
  try {
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const activeUsers = await Message.aggregate([
      {
        $match: {
          createdAt: { $gte: todayStart }
        }
      },
      {
        $group: { _id: "$userId" }
      }
    ]);
    return NextResponse.json({ activeUsersCount: activeUsers.length });
  } catch (error) {
    console.error('Error fetching active users:', error);
    return NextResponse.error();
  }
}
