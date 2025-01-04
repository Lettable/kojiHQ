import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '7d';

async function uploadImage(base64Image) {
    const API_KEY = 'dcf61c7abd01f1d764140f9cdb3d36cc';
    const IMG_API_URL = `https://api.imgbb.com/1/upload?key=${API_KEY}`;

    try {
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
        const formData = new FormData();
        formData.append('image', base64Data);

        const response = await fetch(IMG_API_URL, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (result.success) {
            return result.data.url;
        } else {
            throw new Error(result.status || 'Image upload failed');
        }
    } catch (error) {
        throw new Error('Error uploading image');
    }
}

async function updateUsername(id, newUsername) {
    const usernameRegex = /^[a-zA-Z0-9_]{1,12}$/;
    if (!usernameRegex.test(newUsername)) {
        throw new Error('Invalid username. Username must be up to 12 characters, containing only letters, numbers, and underscores.');
    }

    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    user.username = newUsername;
    user.lastUsernameChange = Date.now()
    await user.save();
    return user;
}

async function updateStatusEmoji(id, statusEmoji) {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    user.statusEmoji = statusEmoji;
    await user.save();
    return user;
}


async function updateBio(id, newBio) {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    user.bio = newBio;
    await user.save();
    return user;
}

async function updateProfilePicture(id, base64Image) {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    const imageUrl = await uploadImage(base64Image);
    user.profilePic = imageUrl;
    user.lastPfpChange = Date.now()
    await user.save();
    return user;
}

function generateToken(user) {
    return jwt.sign(
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
}

export async function POST(req) {
    await connectDB();

    try {
        const action = req.nextUrl.searchParams.get('action');
        const id = req.nextUrl.searchParams.get('id');
        const { newUsername, newBio, profilePic, statusEmoji } = await req.json();

        let updatedUser;

        switch (action) {
            case 'username':
                if (!newUsername) {
                    return NextResponse.json({ success: false, message: 'New username not provided' }, { status: 400 });
                }
                updatedUser = await updateUsername(id, newUsername);
                break;

            case 'bio':
                if (!newBio) {
                    return NextResponse.json({ success: false, message: 'New bio not provided' }, { status: 400 });
                }
                updatedUser = await updateBio(id, newBio);
                break;

            case 'profilePic':
                if (!profilePic) {
                    return NextResponse.json({ success: false, message: 'Profile picture not provided' }, { status: 400 });
                }
                updatedUser = await updateProfilePicture(id, profilePic);
                break;

            case 'statusEmoji':
                if (!statusEmoji) {
                    return NextResponse.json({ success: false, message: 'Status emoji not provided' }, { status: 400 });
                }
                updatedUser = await updateStatusEmoji(id, statusEmoji);
                break;

            default:
                return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
        }

        const newToken = generateToken(updatedUser);

        return NextResponse.json(
            {
                success: true,
                message: `${action.charAt(0).toUpperCase() + action.slice(1)} updated successfully`,
                user: {
                    userId: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    profilePic: updatedUser.profilePic,
                    bio: updatedUser.bio,
                    statusEmoji: updatedUser.statusEmoji,
                },
                accessToken: newToken,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
