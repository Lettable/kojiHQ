import jwt from 'jsonwebtoken';
import User from '@/lib/model/User.model';
import { connectDB } from '@/lib/config/db';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing in environment variables');
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    console.log('Checking user premium status...');

    if (user.isPremium && user.premiumEndDate) {
      const premiumEndDate = new Date(user.premiumEndDate);

      if (premiumEndDate < new Date()) {
        if (user.isPremium) {
          user.isPremium = false;
          user.statusEmoji = null;
          await user.save();
        }
      }
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        telegramUID: user.telegramUID,
        isPremium: user.isPremium,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    return new Response(
      JSON.stringify({ token }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating the latest token:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate token' }),
      { status: 500 }
    );
  }
}
