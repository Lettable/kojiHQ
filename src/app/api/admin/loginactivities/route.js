import { connectDB } from '@/lib/config/db';
import LoginActivity from '@/lib/model/LoginActivity';
import User from '@/lib/model/User.model';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectDB();

    const loginActivities = await LoginActivity.find({}, { userId: 1, ip: 1, device: 1, loginDate: 1 }).lean();

    const userIds = loginActivities.map((activity) => activity.userId);
    const users = await User.find({ _id: { $in: userIds } }, { _id: 1, username: 1 }).lean();

    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = user.username;
      return map;
    }, {});

    const formattedData = loginActivities.map((activity, index) => ({
      id: index + 1,
      username: userMap[activity.userId.toString()] || 'Unknown',
      timestamp: new Date(activity.loginDate).toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: activity.ip,
      device: {
        browser: activity.device.browser,
        platform: activity.device.platform,
      },
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching login activity:', error);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
