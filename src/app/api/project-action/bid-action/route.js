import { connectDB } from '@/lib/config/db';
import Bid from '@/lib/model/Bid';
import Project from '@/lib/model/Product.model';
import User from '@/lib/model/User.model';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectDB();

  try {
    const id = req.nextUrl.searchParams.get('id');
    const { bidderId, bidAmount } = await req.json();

    if (!bidderId || !bidAmount || !id) {
      return NextResponse.json(
        { success: false, message: 'Project ID, Bidder ID, and Bid Amount are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(bidderId) || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    const user = await User.findById(bidderId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    let existingBid = await Bid.findOne({ projectId: id, bidderId });

    if (existingBid) {
      existingBid.bidAmount = bidAmount;
      existingBid.bidDate = new Date();
      await existingBid.save();

      return NextResponse.json(
        { success: true, data: existingBid, message: 'Bid updated successfully' },
        { status: 200 }
      );
    } else {
      const newBid = await Bid.create({
        projectId: id,
        bidderId,
        bidAmount,
      });

      return NextResponse.json(
        { success: true, data: newBid, message: 'Bid placed successfully' },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error placing bid:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function GET(req) {
  await connectDB();

  try {
    const projectId = req.nextUrl.searchParams.get('id');

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Project ID format' },
        { status: 400 }
      );
    }

    const bids = await Bid.find({ projectId }).populate('bidderId', 'username');

    // Format the data as required
    const formattedBids = bids.map((bid) => ({
      id: bid._id,
      author: bid.bidderId.username,
      amount: bid.bidAmount,
      authorId: bid.bidderId._id,
      timestamp: bid.bidDate,
    }));

    return NextResponse.json(
      { success: true, data: formattedBids, message: 'Bids retrieved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving bids:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}