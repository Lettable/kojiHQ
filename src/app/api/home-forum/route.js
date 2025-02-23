import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import CategoryModel from '@/lib/model/Category.model';
import SubCategoryModel from '@/lib/model/SubCategory.model';
import ForumModel from '@/lib/model/Forum.model';
import PostModel from '@/lib/model/Post.model';
import UserModel from '@/lib/model/User.model';
import ThreadModel from '@/lib/model/Thread.model';

export async function GET() {
  try {
    await connectDB();

    // Fetch all categories and sort them by index
    const categories = await CategoryModel.find({}).lean();
    categories.sort((a, b) => a.index - b.index); // Sort categories by index

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
                // Get threads for the specific forum
                const threads = await ThreadModel.find({ forumId: forum._id }).lean();

                // Get the latest post for each thread
                // Get the latest post for the specific forum by finding the latest post across all threads
                const latestPost = await PostModel.findOne({ threadId: { $in: threads.map(thread => thread._id) } })
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

                // Return the latest post for the forum
                return {
                  _id: forum._id,
                  name: forum.name,
                  description: forum.description,
                  latestPost: latestPostData || { user: 'No posts', time: 'Never' }, // Return only the latest post
                };

                // Combine the latest posts for the forum
                return {
                  _id: forum._id,
                  name: forum.name,
                  description: forum.description,
                  latestPosts: latestPosts,
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