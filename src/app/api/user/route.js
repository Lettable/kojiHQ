import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model";
import Project from "@/lib/model/Product.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ThreadModel from "@/lib/model/Thread.model";
import PostModel from "@/lib/model/Post.model";

export async function GET(req) {
    await connectDB();

    try {
        const id = req.nextUrl.searchParams.get("id");
        const username = req.nextUrl.searchParams.get("username");

        let user;

        if (id) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
            }

            user = await User.findById(id);
        } 
        else if (username) {
            user = await User.findOne({ username: { $regex: `^${username}$`, $options: "i" } });
        } else {
            return NextResponse.json({ success: false, message: "Either user ID or username is required" }, { status: 400 });
        }

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Get user's threads with post counts
        const threads = await ThreadModel.aggregate([
            { $match: { userId: user._id } },
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'threadId',
                    as: 'posts'
                }
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    createdAt: 1,
                    tags: 1,
                    likes: { $size: "$likes" },
                    replies: { $size: "$posts" },
                    views: 1,
                    status: 1,
                    isPinned: 1
                }
            }
        ]);

        // Get user's posts in other threads
        const posts = await PostModel.aggregate([
            { $match: { userId: user._id } },
            {
                $lookup: {
                    from: 'threads',
                    localField: 'threadId',
                    foreignField: '_id',
                    as: 'thread'
                }
            },
            {
                $project: {
                    content: 1,
                    createdAt: 1,
                    likes: { $size: "$likes" },
                    threadTitle: { $arrayElemAt: ["$thread.title", 0] },
                    threadId: 1
                }
            }
        ]);

        // Calculate engagement metrics
        const totalLikes = threads.reduce((acc, thread) => acc + thread.likes, 0) + 
                          posts.reduce((acc, post) => acc + post.likes, 0);

        const userData = {
            userId: user._id,
            username: user.username,
            email: user.email,
            statusEmoji: user.statusEmoji,
            bio: user.bio,
            lastPfpChange: user.lastPfpChange,
            lastUsernameChange: user.lastUsernameChange,
            profilePicture: user.profilePic || "",
            isPremium: user.isPremium,
            planName: user.planName,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            reputation: user.reputationTaken,
            stats: {
                threads: threads.length,
                posts: posts.length,
                totalLikes: totalLikes,
                savedThreads: user.savedThreads?.length || 0,
                savedPosts: user.savePost?.length || 0,
                reputation: user.reputationTaken.length
            },
            activity: {
                threads: threads.slice(0, 5),
                posts: posts.slice(0, 5)
            },
            premiumInfo: user.isPremium ? {
                planName: user.planName,
                premiumEndDate: user.premiumEndDate,
                totalSpent: user.totalSpent
            } : null
        };

        return NextResponse.json({ success: true, data: userData }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        }, { status: 500 });
    }
}


export async function DELETE(req, res) {
    await connectDB();

    try {
        const id = req.nextUrl.searchParams.get('id');

        const deletedUser = await User.findByIdAndDelete(id);
        const deleteProjectsOfUser = await Project.findOneAndDelete({ ownerId: id})

        if (!deletedUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Bad request' }, { status: 400 });
    }
}
