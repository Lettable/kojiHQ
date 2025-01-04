import { connectDB } from '@/lib/config/db';
import Comment from '@/lib/model/Comment';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

async function findAndLikeReply(replies, targetId) {
    for (const reply of replies) {
        if (reply._id.toString() === targetId) {
            reply.votes += 1;  // Increment the votes for the reply
            await reply.save({ suppressWarning: true }); // Save the updated reply
            return true;
        }

        // If the reply has nested replies, recurse into them
        if (reply.replies && reply.replies.length > 0) {
            const found = await findAndLikeReply(reply.replies, targetId);
            console.log(found || "__NIGGA__")
            if (found) return true;
        }
    }
    return false;
}

export async function POST(req) {
    const { commentId } = await req.json();

    // Validate the provided commentId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return NextResponse.json(
            { success: false, message: 'Invalid Comment ID format' },
            { status: 400 }
        );
    }

    await connectDB(); // Ensure DB connection

    try {
        // First, try finding the comment with the provided ID
        const comment = await Comment.findById(commentId);

        if (!comment) {
            // If the comment is not found, check if it's a nested reply
            const allComments = await Comment.find({});
            let found = false;

            // Search through all comments and their replies
            for (const c of allComments) {
                if (c.replies.length > 0) {
                    found = await findAndLikeReply(c.replies, commentId);
                    if (found) break; // Stop if the reply is found
                }
            }

            if (!found) {
                return NextResponse.json(
                    { success: false, message: 'Comment or reply not found' },
                    { status: 404 }
                );
            }

            // If the reply was liked successfully, return a success message
            return NextResponse.json(
                { success: true, message: 'Reply liked successfully' },
                { status: 200 }
            );
        }

        // If the comment is found, increment its votes
        comment.votes += 1;
        await comment.save({ suppressWarning: true }); // Save the updated comment

        return NextResponse.json(
            { success: true, message: 'Comment liked successfully', data: comment },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error liking comment or reply:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
