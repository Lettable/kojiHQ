import { connectDB } from '@/lib/config/db';
import Comment from '@/lib/model/Comment';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import User from '@/lib/model/User.model';

async function findAndAddReply(comments, parentCommentId, reply) {
    for (const comment of comments) {
        if (comment._id.toString() === parentCommentId) {
            comment.replies.push(reply);
            await Comment.findByIdAndUpdate(
                comment._id,
                { replies: comment.replies },
                { new: true }
            );
            return true;
        }

        if (comment.replies && comment.replies.length > 0) {
            const found = await findAndAddReply(comment.replies, parentCommentId, reply);
            if (found) return true;
        }
    }
    return false;
}

async function postComment(projectId, userId, author, avatar, content) {
    const newComment = await Comment.create({
        projectId,
        userId,
        author,
        avatar,
        content,
        timestamp: new Date(),
        votes: 0,
        replies: [],
    });

    return newComment;
}

async function postReply(projectId, userId, author, avatar, content, parentCommentId) {
    const comments = await Comment.find({ projectId }).lean();

    const reply = {
        userId,
        author,
        avatar,
        content,
        timestamp: new Date(),
        votes: 0,
        replies: [],
    };

    const replyAdded = await findAndAddReply(comments, parentCommentId, reply);
    if (!replyAdded) {
        throw new Error('Parent comment not found');
    }

    return reply;
}

export async function POST(req) {
    const projectId = req.nextUrl.searchParams.get('id');
    await connectDB();

    try {
        const { userId, author, avatar, content, parentCommentId } = await req.json();

        if (!projectId || !userId || !author || !avatar || !content) {
            return NextResponse.json(
                { success: false, message: 'All required fields must be provided' },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid Project ID or User ID format' },
                { status: 400 }
            );
        }

        if (parentCommentId) {
            if (!mongoose.Types.ObjectId.isValid(parentCommentId)) {
                return NextResponse.json(
                    { success: false, message: 'Invalid Parent Comment ID format' },
                    { status: 400 }
                );
            }

            const reply = await postReply(projectId, userId, author, avatar, content, parentCommentId);

            return NextResponse.json(
                { success: true, data: reply, message: 'Reply added successfully' },
                { status: 201 }
            );
        }

        const newComment = await postComment(projectId, userId, author, avatar, content);

        return NextResponse.json(
            { success: true, data: newComment, message: 'Comment added successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error posting comment or reply:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}


export async function GET(req) {
    await connectDB();

    try {
        const projectId = req.nextUrl.searchParams.get('id');

        if (!projectId) {
            return NextResponse.json(
                { success: false, message: 'Project ID is required' },
                { status: 400 }
            );
        }

        // Fetch comments for the given project
        const comments = await Comment.find({ projectId })
            .sort({ timestamp: -1 })
            .lean();

        // Collect all userIds from comments and replies
        const userIds = new Set();
        comments.forEach(comment => {
            userIds.add(comment.userId.toString());
            comment.replies.forEach(reply => {
                userIds.add(reply.userId.toString());
            });
        });

        // Fetch user data (username and profile picture) for all involved users
        const users = await User.find(
            { _id: { $in: Array.from(userIds) } },
            { _id: 1, username: 1, profilePic: 1 } // Fetch only required fields
        ).lean();

        // Map user data for easy lookup
        const userDataMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = {
                username: user.username,
                avatar: user.profilePic,
            };
            return acc;
        }, {});

        // Format comments and replace author and avatar dynamically
        const formattedComments = comments.map(comment => ({
            id: comment._id,
            author: userDataMap[comment.userId]?.username || comment.author, // Use current username or fallback
            userId: comment.userId,
            avatar: userDataMap[comment.userId]?.avatar || comment.avatar, // Use current avatar or fallback
            content: comment.content,
            timestamp: comment.timestamp,
            votes: comment.votes,
            replies: comment.replies.map(reply => ({
                id: reply._id,
                author: userDataMap[reply.userId]?.username || reply.author, // Use current username or fallback
                userId: reply.userId,
                avatar: userDataMap[reply.userId]?.avatar || reply.avatar, // Use current avatar or fallback
                content: reply.content,
                timestamp: reply.timestamp,
                votes: reply.votes,
            })),
        }));

        return NextResponse.json(
            { success: true, data: formattedComments, message: 'Comments retrieved successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error retrieving comments:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
