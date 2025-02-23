import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model.js';
import LoginActivity from '@/lib/model/LoginActivity';
import { sendLoginNotification } from '@/lib/utils/sendLoginNotification';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '7d';

export async function POST(req) {
  const headersList = headers();
  
  const ip = headersList.get('x-forwarded-for') || 
             headersList.get('x-real-ip') ||
             '0.0.0.0';

  const { email, password, deviceDetails } = await req.json();
  
  const enrichedDeviceDetails = {
    ...deviceDetails,
    ip: ip.split(',')[0].trim()
  };

  try {
    await connectDB();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isBanned) {
      return NextResponse.json(
        { message: 'Your account has been banned. Contact support for assistance.' },
        { status: 403 }
      );
    }

    if (user.isSuspended) {
      const currentTime = new Date();
      if (user.suspendedUntil && user.suspendedUntil > currentTime) {
        return NextResponse.json(
          { 
            message: `Your account is suspended until ${user.suspendedUntil.toLocaleString()}`,
            suspendedUntil: user.suspendedUntil 
          },
          { status: 403 }
        );
      } else {
        await User.updateOne(
          { _id: user._id },
          { $set: { isSuspended: false, suspendedUntil: null } }
        );
        user.isSuspended = false;
        user.suspendedUntil = null;
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const UserToUpdate = await User.findOne({ email });
    UserToUpdate.lastLogin = Date.now();
    await UserToUpdate.save();

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        usernameEffect: user.usernameEffect || "regular-effect",
        email: user.email,
        profilePic: user.profilePic,
        telegramUID: user.telegramUID,
        isPremium: user.isPremium,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    const newLoginActivity = new LoginActivity({
      userId: user._id,
      ip: enrichedDeviceDetails.ip,
      device: enrichedDeviceDetails
    });
    await newLoginActivity.save();

    return NextResponse.json(
      {
        message: 'Signed in successfully',
        user: {
          userId: user._id,
          username: user.username,
          usernameEffect: user.usernameEffect || "regular-effect",
          email: user.email,
          profilePic: user.profilePic,
          bio: user.bio,
          isPublic: user.isPublic,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken: token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error signing in user:', error);

    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { message: 'Database error occurred' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}