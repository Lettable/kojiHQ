import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/lib/model/User.model.js';
import Otp from '@/lib/model/Otp';
import { connectDB } from '@/lib/config/db';
import { setCookie } from 'cookies-next';
import { sendSignupNotification } from '@/lib/utils/sendSignupNotification';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '7d';

export async function POST(request) {
  try {
    await connectDB();

    const { username, email, password, otp, telegramUsername } = await request.json();

    if (!username || !email || !password || !otp) {
      return NextResponse.json(
        { message: 'All fields are required (username, email, password, otp)' },
        { status: 400 }
      );
    }

    if (telegramUsername) {
      const telegramUsernameRegex = /^[a-zA-Z0-9_]{5,32}$/;
      if (!telegramUsernameRegex.test(telegramUsername)) {
        return NextResponse.json(
          { message: 'Invalid Telegram username format' },
          { status: 400 }
        );
      }
    }

    const otpRecord = await Otp.findOne({ requestedByEmail: email, purpose: 'sign-up' });
    if (!otpRecord) {
      return NextResponse.json(
        { message: 'OTP not found for this email' },
        { status: 404 }
      );
    }

    if (String(otpRecord.otp) !== String(otp)) {
      return NextResponse.json(
        { message: 'Invalid OTP' },
        { status: 400 }
      );
    }
    
    const currentTime = new Date();
    if (currentTime > otpRecord.expiresAt) {
      return NextResponse.json(
        { message: 'OTP has expired' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { telegramUsername: telegramUsername ? telegramUsername.toLowerCase() : null }
      ]
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: existingUser.email === email ? 'User already exists' : 'Telegram username already registered' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      usernameEffect: "regular-effect",
      passwordHash,
      telegramUsername: telegramUsername ? telegramUsername.toLowerCase() : null,
      profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2-flKQOIE8ribInudJWpIsy94v1B7LMCemuBf8RcjpIY1Pt3hLHZR5r78rXBFW0cIhVg&usqp=CAU',
      bio: 'Edit your bio...',
      intractedWith: [],
      projects: [],
      savedThreads: [],
      savedPost: [],
    });

    await newUser.save();

    const token = jwt.sign(
      {
        userId: newUser._id,
        username: newUser.username,
        usernameEffect: newUser.usernameEffect,
        email: newUser.email,
        profilePic: newUser.profilePic,
        telegramUsername: newUser.telegramUsername,
        isPremium: false,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    await Otp.deleteOne({ email });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          userId: newUser._id,
          username: newUser.username,
          usernameEffect: newUser.usernameEffect,
          email: newUser.email,
          profilePic: newUser.profilePic,
          bio: newUser.bio,
          createdAt: newUser.createdAt,
        },
        accessToken: token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);

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
