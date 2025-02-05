import { NextResponse } from 'next/server';
import User from "@/lib/model/User.model";

export async function GET() {
  try {
    const users = await User.find({}, 'username usernameEffect statusEmoji');
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.error();
  }
}
