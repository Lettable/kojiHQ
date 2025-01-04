import jwt from 'jsonwebtoken';
import User from '@/lib/model/User.model';
import { connectDB } from '@/lib/config/db';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '7d';

/**
 * Function to generate the latest token for a user based on their premium status.
 * It also updates the user's status if their premium membership has expired.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string>} - A new JWT token for the user.
 */
export async function getLatestToken(userId) {
  try {
    await connectDB();

    const user = await User.findById(userId).lean();

    if (!user) {
      throw new Error('User not found');
    }

    const currentDate = new Date();
    if (user.isPremium && user.premiumEndDate) {
      const premiumEndDate = new Date(user.premiumEndDate);

      if (premiumEndDate < currentDate) {
        await User.findByIdAndUpdate(userId, {
          isPremium: false,
          statusEmoji: null,
        });

        user.isPremium = false;
        user.statusEmoji = null;
      }
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        isPremium: user.isPremium,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    return token;
  } catch (error) {
    console.error('Error generating the latest token:', error.message);
    throw new Error('Failed to generate token');
  }
}
