import { NextResponse } from 'next/server';
import ThreadModel from '@/lib/model/Thread.model.js';
import ForumModel from '@/lib/model/Forum.model.js';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model.js';
import PostModel from '@/lib/model/Post.model.js';

export async function GET(req) {
    await connectDB();

    const threadId = req.nextUrl.searchParams.get('threadId');
    const forumId = req.nextUrl.searchParams.get('forumId');

    if (threadId) {
        const thread = await ThreadModel.findByIdAndUpdate(
            threadId,
            { $inc: { views: 1 } },
            { new: true }
        ).lean();

        if (!thread) {
            return NextResponse.json({ message: 'Thread not found' }, { status: 404 });
        }

        const repliesCount = await PostModel.countDocuments({ threadId: thread._id });
        const author = await User.findById(thread.userId, 'username profilePic usernameEffect').lean();

        const threadResponse = {
            ...thread,
            repliesCount,
            author: {
                _id: author._id,
                username: author.username,
                profilePic: author.profilePic,
                usernameEffect: author.usernameEffect ? author.usernameEffect : 'regular-effect'
            }
        };

        return NextResponse.json(threadResponse, { status: 200 });
    } else if (forumId) {
        const threads = await ThreadModel.find({ forumId })
            .sort({ createdAt: -1 })
            .lean();
        return NextResponse.json(threads, { status: 200 });
    } else {
        return NextResponse.json({ message: 'Either threadId or forumId is required' }, { status: 400 });
    }
}

export async function POST(req) {
    await connectDB();

    const { userId, forumId, title, content, attachments } = await req.json();
    
    if (!forumId || !title || !content) {
        return NextResponse.json({ message: 'Forum ID, title, and content are required' }, { status: 400 });
    }

    const forum = await ForumModel.findById(forumId);
    if (!forum) {
        return NextResponse.json({ message: 'Forum not found' }, { status: 404 });
    }

    try {
        const threadData = {
            userId,
            forumId,
            title,
            content,
            attachments: attachments.map(attachment => ({
                fileName: attachment.fileName,
                fileUrl: attachment.fileUrl,
                fileType: attachment.fileType
            })),
            status: 'active'
        };

        const newThread = new ThreadModel(threadData);
        await newThread.save();

        return NextResponse.json(newThread, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating thread', error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    await connectDB();

    const { threadId, forumId, threadData } = await req.json();
    if (!forumId || !threadId) {
        return NextResponse.json({ message: 'Forum ID and Thread ID are required' }, { status: 400 });
    }

    const thread = await ThreadModel.findOneAndUpdate(
        { _id: threadId, forum: forumId },
        { ...threadData },
        { new: true }
    );

    if (!thread) {
        return NextResponse.json({ message: 'Thread not found' }, { status: 404 });
    }

    return NextResponse.json(thread, { status: 200 });
}

export async function DELETE(req) {
    await connectDB();

    const { threadId, forumId } = await req.json();
    if (!forumId || !threadId) {
        return NextResponse.json({ message: 'Forum ID and Thread ID are required' }, { status: 400 });
    }

    const thread = await ThreadModel.findOneAndDelete({ _id: threadId, forum: forumId });
    if (!thread) {
        return NextResponse.json({ message: 'Thread not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Thread deleted successfully' }, { status: 200 });
}