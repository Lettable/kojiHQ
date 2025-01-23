// pages/api/misc/password.js

import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model";
import bcrypt from "bcrypt";
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectDB();

  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const { oldPassword, newPassword } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User  ID is required.' }, { status: 400 });
    }

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Both old and new passwords are required.' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User  not found.' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Incorrect old password.' }, { status: 401 });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    user.passwordHash = newHashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ error: 'An error occurred while updating the password.' }, { status: 500 });
  }
}