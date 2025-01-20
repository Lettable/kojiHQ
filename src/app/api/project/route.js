import { connectDB } from '@/lib/config/db';
import Project from '@/lib/model/Product.model';
import User from '@/lib/model/User.model';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const projectId = req.nextUrl.searchParams.get('id');
    await connectDB();

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return new Response(
                JSON.stringify({ error: 'Project not found' }),
                { status: 404 }
            );
        }

        project.views += 1;
        await project.save();

        const author = await User.findById(project.ownerId);
        if (!author) {
            return new Response(
                JSON.stringify({ error: 'User not found' }),
                { status: 404 }
            );
        }

        const projectData = {
            title: project.title,
            description: project.description,
            priceType: project.priceType,
            price: project.price,
            views: project.views,
            category: project.category,
            includedItems: project.includedItems,
            additionalItems: project.additionalItems,
            futurePotential: project.futurePotential,
            status: project.productStatus,
            author: {
                id: author._id,
                name: author.username,
                nameEffect: author.usernameEffect || "regular-effect",
                avatar: author.profilePic,
                joinDate: author.createdAt.toLocaleDateString(),
                verified: author.verified,
                statusEmoji: author.statusEmoji,
            },
            tags: project.tags,
            isNegotiable: project.isNegotiable,
            images: project.images,
            buildDetails: project.technicalDetails,
            sellingReason: project.reasonForSelling,
            minBidIncrement: project.incrementBid,
            bidEndDate: project.bidEndDate,
        };

        return NextResponse.json({ projectData }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Error fetching project data:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500 }
        );
    }
}
