// // import { NextResponse } from 'next/server';
// // import { connectDB } from '@/lib/config/db';
// // import ForumModel from '@/lib/model/Forum.model';
// // import ThreadModel from '@/lib/model/Thread.model';
// // import PostModel from '@/lib/model/Post.model';

// // export async function GET() {
// //     try {
// //         await connectDB();

// //         // Get all forums in one query
// //         const forums = await ForumModel.find({}).lean();

// //         // Get all threads in one query
// //         const allThreads = await ThreadModel.find({}).select('_id forumId').lean();

// //         // Create a map of forumId to thread counts and thread IDs
// //         const forumThreadMap = {};
// //         allThreads.forEach(thread => {
// //             const forumId = thread.forumId.toString();
// //             if (!forumThreadMap[forumId]) {
// //                 forumThreadMap[forumId] = {
// //                     count: 0,
// //                     threadIds: []
// //                 };
// //             }
// //             forumThreadMap[forumId].count++;
// //             forumThreadMap[forumId].threadIds.push(thread._id);
// //         });

// //         // Get all posts with their users in one query
// //         const allPosts = await PostModel.find({})
// //             .sort({ createdAt: -1 })
// //             .populate('userId', 'username')
// //             .lean();

// //         // Create a map of forumId to post counts and latest post
// //         const forumPostMap = {};
// //         allPosts.forEach(post => {
// //             const threadId = post.threadId.toString();
// //             for (const [forumId, data] of Object.entries(forumThreadMap)) {
// //                 if (data.threadIds.some(id => id.toString() === threadId)) {
// //                     if (!forumPostMap[forumId]) {
// //                         forumPostMap[forumId] = {
// //                             count: 0,
// //                             latestPost: null
// //                         };
// //                     }
// //                     forumPostMap[forumId].count++;
// //                     if (!forumPostMap[forumId].latestPost || 
// //                         post.createdAt > forumPostMap[forumId].latestPost.createdAt) {
// //                         forumPostMap[forumId].latestPost = post;
// //                     }
// //                     break;
// //                 }
// //             }
// //         });

// //         // Build the final response
// //         const categorizedForums = {};
// //         forums.forEach(forum => {
// //             const forumId = forum._id.toString();
// //             const threadData = forumThreadMap[forumId] || { count: 0, threadIds: [] };
// //             const postData = forumPostMap[forumId] || { count: 0, latestPost: null };

// //             const forumData = {
// //                 id: forum._id,
// //                 title: forum.name,
// //                 threads: threadData.count,
// //                 posts: postData.count,
// //                 lastPost: postData.latestPost ? {
// //                     user: postData.latestPost.userId.username,
// //                     usernameEffect: postData.latestPost.userId.usernameEffect || "regular-effect",
// //                     time: getTimeDifference(postData.latestPost.createdAt)
// //                 } : {
// //                     user: "No posts",
// //                     time: "Never"
// //                 }
// //             };

// //             if (!categorizedForums[forum.category]) {
// //                 categorizedForums[forum.category] = [];
// //             }
// //             categorizedForums[forum.category].push(forumData);
// //         });

// //         return NextResponse.json(categorizedForums, { status: 200 });

// //     } catch (error) {
// //         return NextResponse.json(
// //             { message: 'Internal Server Error', error: error.message },
// //             { status: 500 }
// //         );
// //     }
// // }

// // function getTimeDifference(date) {
// //     const now = new Date();
// //     const diff = now - new Date(date);
// //     const minutes = Math.floor(diff / 60000);
// //     const hours = Math.floor(minutes / 60);
// //     const days = Math.floor(hours / 24);

// //     if (minutes < 60) return `${minutes}m ago`;
// //     if (hours < 24) return `${hours}h ago`;
// //     return `${days}d ago`;
// // }

// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/config/db';
// import ForumModel from '@/lib/model/Forum.model';
// import ThreadModel from '@/lib/model/Thread.model';
// import PostModel from '@/lib/model/Post.model';
// import UserModel from '@/lib/model/User.model';

// export async function GET() {
//     try {
//         await connectDB();

//         // Get all forums in one query
//         const forums = await ForumModel.find({}).lean();

//         // Get all threads in one query
//         const allThreads = await ThreadModel.find({}).select('_id forumId').lean();

//         // Create a map of forumId to thread counts and thread IDs
//         const forumThreadMap = {};
//         allThreads.forEach((thread) => {
//             const forumId = thread.forumId.toString();
//             if (!forumThreadMap[forumId]) {
//                 forumThreadMap[forumId] = {
//                     count: 0,
//                     threadIds: [],
//                 };
//             }
//             forumThreadMap[forumId].count++;
//             forumThreadMap[forumId].threadIds.push(thread._id);
//         });

//         // Get all posts with their userIds
//         const allPosts = await PostModel.find({})
//             .sort({ createdAt: -1 })
//             .select('threadId userId createdAt')
//             .lean();

//         // Fetch user data for all unique userIds
//         const userIds = [...new Set(allPosts.map((post) => post.userId.toString()))];
//         const users = await UserModel.find({ _id: { $in: userIds } })
//             .select('username usernameEffect')
//             .lean();

//         // Create a user map for easy lookup
//         const userMap = {};
//         users.forEach((user) => {
//             userMap[user._id.toString()] = {
//                 username: user.username,
//                 usernameEffect: user.usernameEffect || 'regular-effect',
//             };
//         });

//         // Create a map of forumId to post counts and latest post
//         const forumPostMap = {};
//         allPosts.forEach((post) => {
//             const threadId = post.threadId.toString();
//             for (const [forumId, data] of Object.entries(forumThreadMap)) {
//                 if (data.threadIds.some((id) => id.toString() === threadId)) {
//                     if (!forumPostMap[forumId]) {
//                         forumPostMap[forumId] = {
//                             count: 0,
//                             latestPost: null,
//                         };
//                     }
//                     forumPostMap[forumId].count++;
//                     if (
//                         !forumPostMap[forumId].latestPost ||
//                         post.createdAt > forumPostMap[forumId].latestPost.createdAt
//                     ) {
//                         forumPostMap[forumId].latestPost = {
//                             ...post,
//                             user: userMap[post.userId.toString()],
//                         };
//                     }
//                     break;
//                 }
//             }
//         });

//         // Build the final response
//         const categorizedForums = {};
//         forums.forEach((forum) => {
//             const forumId = forum._id.toString();
//             const threadData = forumThreadMap[forumId] || { count: 0, threadIds: [] };
//             const postData = forumPostMap[forumId] || { count: 0, latestPost: null };

//             const forumData = {
//                 id: forum._id,
//                 title: forum.name,
//                 threads: threadData.count,
//                 posts: postData.count,
//                 lastPost: postData.latestPost
//                     ? {
//                           user: postData.latestPost.user.username,
//                           usernameEffect: postData.latestPost.user.usernameEffect,
//                           time: getTimeDifference(postData.latestPost.createdAt),
//                       }
//                     : {
//                           user: 'No posts',
//                           time: 'Never',
//                       },
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
import CategoryModel from '@/lib/model/Category.model';
import SubCategoryModel from '@/lib/model/SubCategory.model';
import ForumModel from '@/lib/model/Forum.model';
import PostModel from '@/lib/model/Post.model';
import UserModel from '@/lib/model/User.model';

export async function GET() {
  try {
    await connectDB();

    // Fetch all categories
    const categories = await CategoryModel.find({}).lean();

    // Build structured data
    const structuredData = await Promise.all(
      categories.map(async (category) => {
        // Fetch subcategories for the current category
        const subcategories = await SubCategoryModel.find({ category: category._id }).lean();

        const subcategoriesWithForums = await Promise.all(
          subcategories.map(async (subcategory) => {
            // Fetch forums for the current subcategory
            const forums = await ForumModel.find({ subcategory: subcategory._id }).lean();

            const forumsWithLatestPost = await Promise.all(
              forums.map(async (forum) => {
                // Get the latest post for the forum
                const latestPost = await PostModel.findOne({ forumId: forum._id })
                  .sort({ createdAt: -1 })
                  .select('userId createdAt')
                  .lean();

                let latestPostData = null;
                if (latestPost) {
                  const user = await UserModel.findById(latestPost.userId)
                    .select('username usernameEffect')
                    .lean();

                  latestPostData = {
                    user: user?.username || 'Unknown',
                    usernameEffect: user?.usernameEffect || 'regular-effect',
                    time: getTimeDifference(latestPost.createdAt),
                  };
                }

                return {
                  _id: forum._id,
                  name: forum.name,
                  description: forum.description,
                  latestPost: latestPostData || { user: 'No posts', time: 'Never' },
                };
              })
            );

            return {
              _id: subcategory._id,
              name: subcategory.name,
              description: subcategory.description,
              forums: forumsWithLatestPost,
            };
          })
        );

        return {
          _id: category._id,
          name: category.name,
          description: category.description,
          subcategories: subcategoriesWithForums,
        };
      })
    );

    return NextResponse.json(structuredData, { status: 200 });
  } catch (error) {
    console.error(error);
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