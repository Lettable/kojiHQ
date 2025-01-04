import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import ThreadModel from '@/lib/model/Thread.model.js';
import PostModel from '@/lib/model/Post.model.js';
import User from '@/lib/model/User.model';

export async function GET(req) {
    try {
        const userId = req.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        await connectDB();

        const user = await User.findById(userId).select('reputationTaken');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const totalPosts = await PostModel.countDocuments({ userId });

        const totalThreads = await ThreadModel.countDocuments({ userId });

        const reputation = user.reputationTaken.length || 0;

        return NextResponse.json({
            reputation,
            totalPosts,
            totalThreads
        });

    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}