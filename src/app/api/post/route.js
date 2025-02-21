import { connectDB } from '@/lib/config/db';
import PostModel from '@/lib/model/Post.model.js';
import UserModel from '@/lib/model/User.model.js';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectDB();

    const postId = req.nextUrl.searchParams.get('postId');
    const threadId = req.nextUrl.searchParams.get('threadId');

    if (!threadId) {
        return NextResponse.json({ message: 'Thread ID is required' }, { status: 400 });
    }

    if (postId) {
        const post = await PostModel.findById(postId).lean();

        if (!post) {
            return NextResponse.json({ message: 'Post not found' }, { status: 404 });
        }

        const user = await UserModel.findById(post.userId)
            .select('_id username profilePic usernameEffect')
            .lean();

        const formattedPost = {
            _id: post._id,
            content: post.content,
            author: {
                _id: user._id,
                username: user.username,
                profilePic: user.profilePic,
                usernameEffect: user.usernameEffect ? user.usernameEffect : 'regular-effect'
            },
            createdAt: post.createdAt,
            likes: post.likes || [],
            replyPost: post.replyPostId || null
        };

        return NextResponse.json(formattedPost, { status: 200 });
    } else {
        const posts = await PostModel.find({ threadId }).lean();

        const formattedPosts = await Promise.all(posts.map(async post => {
            const user = await UserModel.findById(post.userId)
                .select('_id username profilePic usernameEffect')
                .lean();

            return {
                _id: post._id,
                content: post.content,
                author: {
                    _id: user._id,
                    username: user.username,
                    profilePic: user.profilePic,
                    usernameEffect: user.usernameEffect ? user.usernameEffect : 'regular-effect'
                },
                createdAt: post.createdAt,
                likes: post.likes || [],
                replyPost: post.replyPostId || null
            };
        }));

        return NextResponse.json(formattedPosts, { status: 200 });
    }
}

export async function POST(req) {
    await connectDB();

    const { userId, threadId, content, replyPostId } = await req.json();

    if (!threadId || !content) {
        return NextResponse.json({ message: 'Thread ID and Content are required' }, { status: 400 });
    }

    const newPost = new PostModel({
        userId,
        threadId,
        content,
        replyPostId,
    });

    await newPost.save();

    const populatedPost = await PostModel.findById(newPost._id).lean();

    const user = await UserModel.findById(populatedPost.userId)
        .select('_id username profilePic usernameEffect')
        .lean();

    const formattedPost = {
        _id: populatedPost._id,
        content: populatedPost.content,
        author: {
            _id: user._id,
            username: user.username,
            profilePic: user.profilePic,
            usernameEffect: user.usernameEffect ? user.usernameEffect : 'regular-effect'
        },
        createdAt: populatedPost.createdAt,
        likes: populatedPost.likes || [],
        replyPost: populatedPost.replyPostId || null
    };

    // const ws = new WebSocket('wss://kojihq-ws.onrender.com');
    // ws.onopen = () => {
    //     ws.send(JSON.stringify({
    //         type: 'post',
    //         _id: populatedPost._id,
    //         content: populatedPost.content
    //     }));
    //     ws.close();
    // };

    return NextResponse.json(formattedPost, { status: 201 });
}

export async function PUT(req) {
    await connectDB();

    const headersList = await headers();
    const token = headersList.get("x-auth-token");
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { postId, forumId, threadId, ...updateData } = await req.json();

    if (!postId || !forumId || !threadId) {
        return NextResponse.json({ message: 'Post ID, Forum ID, and Thread ID are required' }, { status: 400 });
    }

    const post = await PostModel.findOneAndUpdate(
        { _id: postId, forumId, threadId, userId: user._id },
        updateData,
        { new: true }
    );

    if (!post) {
        return NextResponse.json({ message: 'Post not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
}

export async function DELETE(req) {
    await connectDB();

    const headersList = await headers();
    const token = headersList.get("x-auth-token");
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { postId, forumId, threadId } = await req.json();

    if (!postId || !forumId || !threadId) {
        return NextResponse.json({ message: 'Post ID, Forum ID, and Thread ID are required' }, { status: 400 });
    }

    const post = await PostModel.findOneAndDelete({ _id: postId, forumId, threadId, userId: user._id });

    if (!post) {
        return NextResponse.json({ message: 'Post not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
}