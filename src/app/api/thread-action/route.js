import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import Thread from '@/lib/model/Thread.model';
import PostModel from '@/lib/model/Post.model';
import User from '@/lib/model/User.model';


export async function GET(req) {
    await connectDB();

    const forumId = req.nextUrl.searchParams.get('forumId');
    const page = parseInt(req.nextUrl.searchParams.get('page')) || 1;
    const limit = 10;
    
    try {
        const pinnedThreads = await Thread.find({
            forumId: forumId,
            isPinned: true,
            status: 'active'
        })
        .populate({ path: 'userId', model: 'User', select: 'username profilePic' })
        .sort({ createdAt: -1 });

        const skip = (page - 1) * limit;
        const nonPinnedThreads = await Thread.find({
            forumId: forumId,
            isPinned: false,
            status: 'active'
        })
        .populate({ path: 'userId', model: 'User', select: 'username profilePic' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const allThreads = [...pinnedThreads, ...nonPinnedThreads];
        
        const formattedThreads = await Promise.all(allThreads.map(async thread => {
            const replyCount = await PostModel.countDocuments({ threadId: thread._id });
            return {
                id: thread._id,
                title: thread.title,
                creator: thread.userId.username,
                profilePic: thread.userId.profilePic,
                createdAt: thread.createdAt,
                replies: replyCount,
                views: thread.views,
                isPinned: thread.isPinned,
                status: thread.status
            };
        }));

        const totalThreads = await Thread.countDocuments({
            forumId: forumId,
            isPinned: false,
            status: 'active'
        });

        return NextResponse.json({
            threads: formattedThreads,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalThreads / limit),
                totalThreads: totalThreads,
                hasMore: totalThreads > skip + limit
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}