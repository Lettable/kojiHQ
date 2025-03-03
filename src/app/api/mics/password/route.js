// pages/api/misc/password.js

import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model";
import bcrypt from "bcrypt";
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  await connectDB();

  try {
    const token = req.nextUrl.searchParams.get('token');
    const { oldPassword, newPassword } = await req.json();

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    const userId = decoded.userId

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