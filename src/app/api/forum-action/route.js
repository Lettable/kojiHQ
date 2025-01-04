import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import Forum from '@/lib/model/Forum.model.js';
import Thread from '@/lib/model/Thread.model.js';
import Post from '@/lib/model/Post.model.js';

export async function GET(req) {
    await connectDB();

    const forumId = req.nextUrl.searchParams.get('forumId');

    if (!forumId) {
        return NextResponse.json({ message: 'Forum ID is required' }, { status: 400 });
    }

    try {
        const forum = await Forum.findById(forumId);
        
        if (!forum) {
            return NextResponse.json({ message: 'Forum not found' }, { status: 404 });
        }

        const totalThreads = await Thread.countDocuments({ forumId });

        const threadsInForum = await Thread.find({ forumId }).select('_id');
        const threadIds = threadsInForum.map(thread => thread._id);
        const totalPosts = await Post.countDocuments({ threadId: { $in: threadIds } });

        const latestThread = await Thread.findOne({ forumId })
            .sort({ createdAt: -1 })
            .select('createdAt');
        
        const latestPost = await Post.findOne({ threadId: { $in: threadIds } })
            .sort({ createdAt: -1 })
            .select('createdAt');

        const lastActiveDate = latestPost && latestThread 
            ? new Date(Math.max(new Date(latestPost.createdAt), new Date(latestThread.createdAt)))
            : latestThread 
                ? latestThread.createdAt 
                : forum.createdAt;

        const timeDiff = getTimeDifference(lastActiveDate);

        const forumData = {
            id: forum._id,
            name: forum.name,
            description: forum.description,
            category: forum.category,
            totalThreads,
            totalPosts,
            lastActive: timeDiff,
            isClosed: forum.isClosed,
            closedUntill: forum.closedUntill
        };

        return NextResponse.json(forumData, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

function getTimeDifference(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}