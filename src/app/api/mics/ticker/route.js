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
  
      const userIds = new Set([
        ...threads.map(t => t.userId.toString()),
        ...posts.map(p => p.userId.toString()),
        ...products.map(p => p.ownerId.toString())
      ]);
  
      const users = await User.find({ _id: { $in: [...userIds] } }).lean();
      const userMap = users.reduce((acc, user) => {
        acc[user._id.toString()] = {
          profilePic: user.profilePic || "",
          username: user.username || "Anon",
          usernameEffect: user.usernameEffect || "",
        };
        return acc;
      }, {});
  
      const threadIds = [...new Set(posts.map(p => p.threadId.toString()))];
      const threadData = await ThreadModel.find({ _id: { $in: threadIds } }).lean();
      const threadMap = threadData.reduce((acc, thread) => {
        acc[thread._id.toString()] = `/thread/${thread._id}`;
        return acc;
      }, {});
  
      const formattedThreads = threads.map(thread => ({
        id: thread._id,
        title: thread.title,
        profilePic: userMap[thread.userId]?.profilePic,
        username: userMap[thread.userId]?.username,
        usernameEffect: userMap[thread.userId]?.usernameEffect,
        link: `/thread/${thread._id}`,
        createdAt: thread.createdAt,
      }));
  
      const formattedPosts = posts.map(post => ({
        id: post._id,
        title: post.content.substring(0, 50),
        profilePic: userMap[post.userId]?.profilePic,
        username: userMap[post.userId]?.username,
        usernameEffect: userMap[post.userId]?.usernameEffect,
        link: threadMap[post.threadId] || "#",
        createdAt: post.createdAt,
      }));
  
      const formattedProducts = products.map(product => ({
        id: product._id,
        title: product.title,
        profilePic: userMap[product.ownerId]?.profilePic,
        username: userMap[product.ownerId]?.username,
        usernameEffect: userMap[product.ownerId]?.usernameEffect,
        link: `/product/${product._id}`,
        createdAt: product.createdAt,
      }));
  
      return Response.json({
        threads: formattedThreads,
        posts: formattedPosts,
        products: formattedProducts,
      });
    } catch (error) {
      console.error("Feed API Error:", error);
      return Response.json({ error: "Failed to fetch feed activity" }, { status: 500 });
    }
  }