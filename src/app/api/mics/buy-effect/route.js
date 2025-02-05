import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';

const JWT_SECRET = process.env.JWT_SECRET;

const EFFECTS = [
  { name: 'Sparkle', class: 'sparkle-effect', price: 4.99 },
  { name: 'Neon', class: 'neon-effect', price: 5.99 },
  { name: 'Olympus', class: 'olympus-effect', price: 9.99 },
  { name: 'Rainbow', class: 'rainbow-effect', price: 6.99 },
  { name: 'Fire', class: 'fire-effect', price: 4.99 },
  { name: 'Snow', class: 'snow-effect', price: 4.99 },
  { name: 'Shadow', class: 'shadow-effect', price: 3.99 },
  { name: 'Retro', class: 'retro-effect', price: 4.99 },
  { name: 'Cosmic', class: 'cosmic-effect', price: 8.99 },
  { name: 'Pixel', class: 'pixel-effect', price: 5.99 },
  { name: 'Glowing', class: 'glowing-effect', price: 6.99 }
];

export async function POST(request) {
  try {
    await connectDB();

    const { token, effectToBuy } = await request.json();

    if (!token || !effectToBuy) {
      return NextResponse.json(
        { message: 'Token and effectToBuy are required' },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const selectedEffect = EFFECTS.find(
      effect => effect.class === effectToBuy
    );

    if (!selectedEffect) {
      return NextResponse.json(
        { message: 'No matched username effect found' },
        { status: 400 }
      );
    }

    if (user.credits < selectedEffect.price) {
      return NextResponse.json(
        { message: 'Not enough credits to purchase this effect' },
        { status: 403 }
      );
    }

    user.credits -= selectedEffect.price;
    if (!user.storedUsernameEffects.includes(effectToBuy)) {
      user.storedUsernameEffects.push(effectToBuy);
    }
    await user.save();

    return NextResponse.json(
      {
        message: 'Username effect purchased successfully',
        remainingCredits: user.credits,
        purchasedEffect: selectedEffect.class
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error purchasing username effect:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
