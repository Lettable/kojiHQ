import { connectDB } from "@/lib/config/db";
import ThreadModel from "@/lib/model/Thread.model";
import PostModel from "@/lib/model/Post.model";
import ProductModel from "@/lib/model/Product.model";
import User from "@/lib/model/User.model";

export async function GET() {
  try {
    await connectDB();

    const threads = await ThreadModel.find().sort({ createdAt: -1 }).limit(10);
    const posts = await PostModel.find().sort({ createdAt: -1 }).limit(10);
    const products = await ProductModel.find().sort({ createdAt: -1 }).limit(10);

    const getUserDetails = async (userId) => {
      const user = await User.findById(userId);
      return user ? {
        profilePic: user.profilePic || "",
        username: user.username || "Anon",
        usernameEffect: user.usernameEffect || "",
      } : null;
    };

    const formattedThreads = await Promise.all(threads.map(async (thread) => {
      const user = await getUserDetails(thread.userId);
      return {
        id: thread._id,
        title: thread.title.substring(0, 50),
        profilePic: user?.profilePic,
        username: user?.username,
        usernameEffect: user?.usernameEffect || "regular-effect",
        link: `/thread/${thread._id}`,
        createdAt: thread.createdAt,
      };
    }));

    const formattedPosts = await Promise.all(posts.map(async (post) => {
      const user = await getUserDetails(post.userId);
      const thread = await Thread.findOne({ _id: post.threadId });
      return {
        id: post._id,
        title: post.content.substring(0, 50),
        profilePic: user?.profilePic,
        username: user?.username,
        usernameEffect: user?.usernameEffect || "regular-effect",
        link: thread ? `/thread/${thread._id}` : "#",
        createdAt: post.createdAt,
      };
    }));

    const formattedProducts = await Promise.all(products.map(async (product) => {
      const user = await getUserDetails(product.ownerId);
      return {
        id: product._id,
        title: product.title.substring(0, 50),
        profilePic: user?.profilePic,
        username: user?.username,
        usernameEffect: user?.usernameEffect || "regular-effect",
        link: `/product/${product._id}`,
        createdAt: product.createdAt,
      };
    }));

    return Response.json({
      threads: formattedThreads,
      posts: formattedPosts,
      products: formattedProducts,
    });
  } catch (error) {
    return Response.json({ error: "Failed to fetch feed activity" }, { status: 500 });
  }
}
