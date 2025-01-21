// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/config/db';
// import ForumModel from '@/lib/model/Forum.model';
// import ThreadModel from '@/lib/model/Thread.model';
// import PostModel from '@/lib/model/Post.model';

// export async function GET() {
//     try {
//         await connectDB();

//         // Get all forums in one query
//         const forums = await ForumModel.find({}).lean();

//         // Get all threads in one query
//         const allThreads = await ThreadModel.find({}).select('_id forumId').lean();

//         // Create a map of forumId to thread counts and thread IDs
//         const forumThreadMap = {};
//         allThreads.forEach(thread => {
//             const forumId = thread.forumId.toString();
//             if (!forumThreadMap[forumId]) {
//                 forumThreadMap[forumId] = {
//                     count: 0,
//                     threadIds: []
//                 };
//             }
//             forumThreadMap[forumId].count++;
//             forumThreadMap[forumId].threadIds.push(thread._id);
//         });

//         // Get all posts with their users in one query
//         const allPosts = await PostModel.find({})
//             .sort({ createdAt: -1 })
//             .populate('userId', 'username')
//             .lean();

//         // Create a map of forumId to post counts and latest post
//         const forumPostMap = {};
//         allPosts.forEach(post => {
//             const threadId = post.threadId.toString();
//             for (const [forumId, data] of Object.entries(forumThreadMap)) {
//                 if (data.threadIds.some(id => id.toString() === threadId)) {
//                     if (!forumPostMap[forumId]) {
//                         forumPostMap[forumId] = {
//                             count: 0,
//                             latestPost: null
//                         };
//                     }
//                     forumPostMap[forumId].count++;
//                     if (!forumPostMap[forumId].latestPost || 
//                         post.createdAt > forumPostMap[forumId].latestPost.createdAt) {
//                         forumPostMap[forumId].latestPost = post;
//                     }
//                     break;
//                 }
//             }
//         });

//         // Build the final response
//         const categorizedForums = {};
//         forums.forEach(forum => {
//             const forumId = forum._id.toString();
//             const threadData = forumThreadMap[forumId] || { count: 0, threadIds: [] };
//             const postData = forumPostMap[forumId] || { count: 0, latestPost: null };

//             const forumData = {
//                 id: forum._id,
//                 title: forum.name,
//                 threads: threadData.count,
//                 posts: postData.count,
//                 lastPost: postData.latestPost ? {
//                     user: postData.latestPost.userId.username,
//                     usernameEffect: postData.latestPost.userId.usernameEffect || "regular-effect",
//                     time: getTimeDifference(postData.latestPost.createdAt)
//                 } : {
//                     user: "No posts",
//                     time: "Never"
//                 }
//             };

//             if (!categorizedForums[forum.category]) {
//                 categorizedForums[forum.category] = [];
//             }
//             categorizedForums[forum.category].push(forumData);
//         });

//         return NextResponse.json(categorizedForums, { status: 200 });

//     } catch (error) {
//         return NextResponse.json(
//             { message: 'Internal Server Error', error: error.message },
//             { status: 500 }
//         );
//     }
// }

// function getTimeDifference(date) {
//     const now = new Date();
//     const diff = now - new Date(date);
//     const minutes = Math.floor(diff / 60000);
//     const hours = Math.floor(minutes / 60);
//     const days = Math.floor(hours / 24);

//     if (minutes < 60) return `${minutes}m ago`;
//     if (hours < 24) return `${hours}h ago`;
//     return `${days}d ago`;
// }

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import ForumModel from '@/lib/model/Forum.model';
import ThreadModel from '@/lib/model/Thread.model';
import PostModel from '@/lib/model/Post.model';
import UserModel from '@/lib/model/User.model';

export async function GET() {
    try {
        await connectDB();

        // Get all forums in one query
        const forums = await ForumModel.find({}).lean();

        // Get all threads in one query
        const allThreads = await ThreadModel.find({}).select('_id forumId').lean();

        // Create a map of forumId to thread counts and thread IDs
        const forumThreadMap = {};
        allThreads.forEach((thread) => {
            const forumId = thread.forumId.toString();
            if (!forumThreadMap[forumId]) {
                forumThreadMap[forumId] = {
                    count: 0,
                    threadIds: [],
                };
            }
            forumThreadMap[forumId].count++;
            forumThreadMap[forumId].threadIds.push(thread._id);
        });

        // Get all posts with their userIds
        const allPosts = await PostModel.find({})
            .sort({ createdAt: -1 })
            .select('threadId userId createdAt')
            .lean();

        // Fetch user data for all unique userIds
        const userIds = [...new Set(allPosts.map((post) => post.userId.toString()))];
        const users = await UserModel.find({ _id: { $in: userIds } })
            .select('username usernameEffect')
            .lean();

        // Create a user map for easy lookup
        const userMap = {};
        users.forEach((user) => {
            userMap[user._id.toString()] = {
                username: user.username,
                usernameEffect: user.usernameEffect || 'regular-effect',
            };
        });

        // Create a map of forumId to post counts and latest post
        const forumPostMap = {};
        allPosts.forEach((post) => {
            const threadId = post.threadId.toString();
            for (const [forumId, data] of Object.entries(forumThreadMap)) {
                if (data.threadIds.some((id) => id.toString() === threadId)) {
                    if (!forumPostMap[forumId]) {
                        forumPostMap[forumId] = {
                            count: 0,
                            latestPost: null,
                        };
                    }
                    forumPostMap[forumId].count++;
                    if (
                        !forumPostMap[forumId].latestPost ||
                        post.createdAt > forumPostMap[forumId].latestPost.createdAt
                    ) {
                        forumPostMap[forumId].latestPost = {
                            ...post,
                            user: userMap[post.userId.toString()],
                        };
                    }
                    break;
                }
            }
        });

        // Build the final response
        const categorizedForums = {};
        forums.forEach((forum) => {
            const forumId = forum._id.toString();
            const threadData = forumThreadMap[forumId] || { count: 0, threadIds: [] };
            const postData = forumPostMap[forumId] || { count: 0, latestPost: null };

            const forumData = {
                id: forum._id,
                title: forum.name,
                threads: threadData.count,
                posts: postData.count,
                lastPost: postData.latestPost
                    ? {
                          user: postData.latestPost.user.username,
                          usernameEffect: postData.latestPost.user.usernameEffect,
                          time: getTimeDifference(postData.latestPost.createdAt),
                      }
                    : {
                          user: 'No posts',
                          time: 'Never',
                      },
            };

            if (!categorizedForums[forum.category]) {
                categorizedForums[forum.category] = [];
            }
            categorizedForums[forum.category].push(forumData);
        });

        return NextResponse.json(categorizedForums, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
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
