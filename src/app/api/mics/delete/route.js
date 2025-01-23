import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model";
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function DELETE(req) {
  await connectDB();

  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const { token } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'UserID is required.' }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ error: 'Token is required.' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tokenUserId = decoded.userId;

    if (tokenUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized action. UserID does not match.' }, { status: 403 });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User account deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: 'An error occurred while deleting the account.' }, { status: 500 });
  }
}