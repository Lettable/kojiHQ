import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model";
import Post from "@/lib/model/Post.model";
import Thread from "@/lib/model/Thread.model";
import { NextResponse } from 'next/server';

export async function GET(req) {
  await connectDB();

  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User  ID is required.' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User  not found.' }, { status: 404 });
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const posts = await Post.find({ userId, createdAt: { $gte: sevenDaysAgo } });
    const threads = await Thread.find({ userId, createdAt: { $gte: sevenDaysAgo } });

    const activityData = [];
    const postDates = posts.map((post) => post.createdAt.toISOString().split('T')[0]);
    const threadDates = threads.map((thread) => thread.createdAt.toISOString().split('T')[0]);

    const allActivityDates = [...postDates, ...threadDates];
    const activityMap = allActivityDates.reduce((acc, date) => {
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    for (const [date, count] of Object.entries(activityMap)) {
      activityData.push({ date, posts: count });
    }

    const defaultSpotify = 'spotify:track:default';
    const defaultYoutube = 'https://youtube.com/watch?v=default';

    // Create the stored username effects array
    const storedUsernameEffects = (user.storedUsernameEffects || []).map(effect => {
      const label = effect.split('-')[0]; // Get the label from the effect name
      return {
        value: effect,
        label: label.charAt(0).toUpperCase() + label.slice(1) // Capitalize the first letter of the label
      };
    });

    const responseData = {
      userId: user._id,
      username: user.username,
      statusEmoji: user.statusEmoji,
      profilePic: user.profilePic || '/placeholder.svg?height=200&width=200',
      bio: user.bio || 'Passionate forum enthusiast and tech lover',
      createdAt: user.createdAt,
      lastUsernameChange: user.lastUsernameChange,
      lastPfpChange: user.lastPfpChange,
      isPremium: user.isPremium,
      reputation: user.reputationTaken.length,
      threadCount: threads.length,
      postCount: posts.length,
      savedThreads: user.savedThreads?.length || 0,
      usernameEffect: user.usernameEffect || 'none',
      favSpotifySongOrPlaylist: user.favSpotifySongOrPlaylist || defaultSpotify,
      favYtVideo: user.favYtVideo || defaultYoutube,
      signature: user.signature || '**Tech Enthusiast** | _Forum Veteran_',
      lastLogin: user.lastLogin,
      activityData,
      storedUsernameEffects, // Return the formatted stored username effects
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching user data.' }, { status: 500 });
  }
}