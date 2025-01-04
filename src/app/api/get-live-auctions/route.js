import { connectDB } from '@/lib/config/db';
import Project from '@/lib/model/Product.model';
import Bid from '@/lib/model/Bid';
import { NextResponse } from 'next/server';

export async function GET() {
    await connectDB();

    try {
        const currentTime = new Date();

        // Fetch projects with active bidding (live auctions)
        const liveAuctions = await Project.find({
            priceType: 'bid', // Only bidding projects
            bidEndDate: { $gt: currentTime }, // Auctions that haven't ended
        }).lean();

        const projectIds = liveAuctions.map(project => project._id);

        // Fetch all bids associated with live auction projects
        const bids = await Bid.find({
            projectId: { $in: projectIds },
        }).lean();

        // Group bids by projectId and find the highest bid for each project
        const bidMap = {};
        bids.forEach(bid => {
            const projectId = bid.projectId.toString();
            if (!bidMap[projectId] || bid.bidAmount > bidMap[projectId].bidAmount) {
                bidMap[projectId] = {
                    bidAmount: bid.bidAmount,
                };
            }
        });

        // Format the response with project details and highest bids
        const formattedAuctions = liveAuctions.map(project => ({
            id: project._id,
            title: project.title,
            highestBid: bidMap[project._id.toString()]?.bidAmount || project.startingBid, // Default to startingBid if no bids
        }));

        return NextResponse.json(
            { success: true, auctions: formattedAuctions },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching live auctions:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
