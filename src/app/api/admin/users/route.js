import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({});

    const formattedUsers = users.map((user) => ({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      verified: user.verified,
      followers: user.followers,
      following: user.following,
      notifications: user.notifications,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
