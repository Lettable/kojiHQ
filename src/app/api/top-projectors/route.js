import { connectDB } from '@/lib/config/db';
import Project from '@/lib/model/Product.model';
import Comment from '@/lib/model/Comment';
import User from '@/lib/model/User.model';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectDB();

    try {
        // Fetch all users
        const users = await User.find({}, { _id: 1, profilePic: 1, username: 1 }).lean();

        // Fetch all projects
        const projects = await Project.find({}, { ownerId: 1, createdAt: 1 }).lean();

        // Fetch all comments
        const comments = await Comment.find({}, { userId: 1, timestamp: 1 }).lean();

        // Initialize a scoring object
        const userScores = {};

        // Assign base user info to scores
        users.forEach(user => {
            userScores[user._id.toString()] = {
                userId: user._id,
                username: user.username,
                avatar: user.profilePic,
                score: 0,
            };
        });

        // Calculate points from projects
        projects.forEach(project => {
            const ownerId = project.ownerId.toString();
            if (userScores[ownerId]) {
                userScores[ownerId].score += 5; // Each project gives 5 points

                // Bonus for recent activity (last 7 days)
                const daysAgo = (Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24);
                if (daysAgo <= 7) {
                    userScores[ownerId].score += 3; // Bonus for recent activity
                }
            }
        });

        // Calculate points from comments
        comments.forEach(comment => {
            const userId = comment.userId.toString();
            if (userScores[userId]) {
                userScores[userId].score += 2; // Each comment gives 2 points

                // Bonus for recent activity (last 7 days)
                const daysAgo = (Date.now() - new Date(comment.timestamp).getTime()) / (1000 * 60 * 60 * 24);
                if (daysAgo <= 7) {
                    userScores[userId].score += 3; // Bonus for recent activity
                }
            }
        });

        // Sort users by score in descending order
        const topProjectors = Object.values(userScores)
            .filter(user => user.score > 0) // Only include active users with scores > 0
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Return the top 10 projectors

        return NextResponse.json({ success: true, topProjectors }, { status: 200 });

    } catch (error) {
        console.error('Error fetching top projectors:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
