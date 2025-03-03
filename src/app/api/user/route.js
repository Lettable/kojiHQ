import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model";
import Project from "@/lib/model/Product.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ThreadModel from "@/lib/model/Thread.model";
import PostModel from "@/lib/model/Post.model";
import jwt from "jsonwebtoken";

export async function GET(req) {
    await connectDB();
  
    try {
      const token = req.nextUrl.searchParams.get("token");
      if (!token) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const visitorUserId = decoded.userId;
  
      const id = req.nextUrl.searchParams.get("id");
      const username = req.nextUrl.searchParams.get("username");
  
      let user;
  
      if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
        }
        user = await User.findById(id);
      } else if (username) {
        user = await User.findOne({ username: { $regex: `^${username}$`, $options: "i" } });
      } else {
        return NextResponse.json({ success: false, message: "Either user ID or username is required" }, { status: 400 });
      }
  
      if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      }
  
      if (visitorUserId !== user._id.toString()) {
        const newVisitor = {
          visitorId: visitorUserId,
          visitedAt: new Date()
        };
  
        const updatedVisitors = [newVisitor, ...user.latestVisitors].slice(0, 10);
        user.latestVisitors = updatedVisitors;
        await user.save();
      }
  
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
  
      const reputationGivers = await User.aggregate([
        {
          $match: {
            _id: { $in: user.reputationTaken.map(rep => 
              rep.userId instanceof mongoose.Types.ObjectId ? rep.userId : new mongoose.Types.ObjectId(rep.userId)
            )}
          }
        },
        {
          $project: {
            username: 1,
            profilePic: 1,
            statusEmoji: 1,
            usernameEffect: 1
          }
        }
      ]);
  
      const reputationData = user.reputationTaken.map(rep => {
        const repUserId = rep.userId instanceof mongoose.Types.ObjectId 
          ? rep.userId.toString() 
          : rep.userId;
  
        const giver = reputationGivers.find(g => g._id.toString() === repUserId);
        
        return {
          userId: repUserId,
          username: giver?.username || 'Unknown User',
          profilePic: giver?.profilePic || null,
          usernameEffect: giver?.usernameEffect || 'regular-effect',
          statusEmoji: giver?.statusEmoji || null,
          message: rep.message || '',
          type: rep.type || 'positive',
          givenAt: rep.givenAt || new Date()
        };
      });
  
      const totalLikes = threads.reduce((acc, thread) => acc + thread.likes, 0) +
        posts.reduce((acc, post) => acc + post.likes, 0);
  
      const latestVisitorDetails = await User.find(
        { _id: { $in: user.latestVisitors.map(visitor => visitor.visitorId) } },
        { _id: 1, username: 1, usernameEffect: 1, statusEmoji: 1, profilePic: 1 }
      );
  
      // Handle isBanned and isSuspended logic
      let userGroups = user.groups || [];
      if (user.isBanned) {
        
        userGroups = [
            {
                "groupName": "banned",
                "assignedAt": "2025-01-24T12:31:35.409Z",
                "_id": "6793882784f67a8d0e3ed743"
            }
        ];
      }
  
      const reputationCount = reputationData.reduce((acc, rep) => {
        return acc + (rep.type === 'positive' ? 1 : -1);
      }, 0);
  
      const userData = {
        userId: user._id,
        username: user.username,
        usernameEffect: user.usernameEffect || "regular-effect",
        signature: user.signature || "",
        groups: userGroups,
        statusEmoji: user.statusEmoji,
        bio: user.bio,
        bannerImg: user.bannerImg || "",
        btcAddress: user.btcAddress || "",
        credits: user.credits || 0,
        favYtVideo: user.favYtVideo,
        lastPfpChange: user.lastPfpChange,
        lastUsernameChange: user.lastUsernameChange,
        profilePicture: user.profilePic || "",
        isPremium: user.isPremium,
        telegramUID: user.telegramUID || "",
        discordId: user.discordId || "",
        planName: user.planName,
        favSpotifyTrack: user.favSpotifyTrack || "",
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        reputation: user.reputationTaken || [],
        reputationGivers: reputationData,
        stats: {
          threads: threads.length,
          posts: posts.length,
          totalLikes: totalLikes,
          savedThreads: user.savedThreads?.length || 0,
          savedPosts: user.savePost?.length || 0,
          reputation: reputationCount
        },
        activity: {
          threads: threads.slice(0, 5),
          posts: posts.slice(0, 5)
        },
        premiumInfo: user.isPremium ? {
          planName: user.planName,
          premiumEndDate: user.premiumEndDate,
          totalSpent: user.totalSpent
        } : null,
        latestVisitors: latestVisitorDetails.map(visitor => ({
          userId: visitor._id,
          username: visitor.username,
          usernameEffect: visitor.usernameEffect,
          statusEmoji: visitor.statusEmoji,
          profilePic: visitor.profilePic
        })),
        isBanned: user.isBanned || false,
        isSuspended: user.isSuspended || false,
        suspendUntil: user.isSuspended ? user.suspendedUntil : null
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
        const deleteProjectsOfUser = await Project.findOneAndDelete({ ownerId: id })

        if (!deletedUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Bad request' }, { status: 400 });
    }
}
