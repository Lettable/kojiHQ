import { connectDB } from '@/lib/config/db';
import Project from '@/lib/model/Product.model';
import ProductModel from '@/lib/model/Product.model';
import User from '@/lib/model/User.model';
import Comment from '@/lib/model/Comment';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const page = req.nextUrl.searchParams.get("page");
    const productsPerPage = 10;

    await connectDB();

    try {
        // Parse the page number and handle invalid page number
        const pageNumber = parseInt(page);
        if (isNaN(pageNumber) || pageNumber <= 0) {
            return new Response(
                JSON.stringify({ error: 'Invalid page number' }),
                { status: 400 }
            );
        }

        // Fetch paginated projects
        const products = await ProductModel.find()
            .skip((pageNumber - 1) * productsPerPage)
            .limit(productsPerPage)
            .lean();

        // Fetch the total count of projects to calculate total pages
        const totalProducts = await ProductModel.countDocuments();

        // Fetch all parent comments (comments with parentId = null)
        const commentsData = await Comment.find({ parentId: null })
            .lean();

        // Collect user IDs from projects and comments
        const userIds = new Set();
        products.forEach(product => userIds.add(product.ownerId.toString()));
        commentsData.forEach(comment => userIds.add(comment.userId.toString()));

        // Fetch user data (username, profilePic) for all unique userIds
        const users = await User.find(
            { _id: { $in: Array.from(userIds) } },
            { _id: 1, username: 1, profilePic: 1, verified: 1 }
        ).lean();

        // Create a user data map for efficient access
        const userDataMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = {
                userId: user._id,
                username: user.username,
                avatar: user.profilePic,
                verified: user.verified || false,
            };
            return acc;
        }, {});

        // Format the projects and add author and top-level comments (without replies)
        const formattedProducts = products.map(product => {
            const author = userDataMap[product.ownerId.toString()] || {
                userId: product.ownerId.toString(),
                username: 'Unknown',
                avatar: '',
                verified: false,
            };

            const productComments = commentsData.filter(
                comment => comment.projectId.toString() === product._id.toString()
            );

            const formattedComments = productComments.map(comment => ({
                id: comment._id,
                author: userDataMap[comment.userId.toString()]?.username || 'Unknown',
                avatar: userDataMap[comment.userId.toString()]?.avatar || '',
                content: comment.content,
                timestamp: comment.timestamp,
                replyCount: comment.replies ? comment.replies.length : 0,
            }));

            return {
                id: product._id,
                title: product.title,
                description: product.description,
                price: product.price,
                category: product.category,
                status: product.productStatus,
                showcase: product.productStatus.toLowerCase() === 'showcasing',
                isAuction: product.priceType.toLowerCase() === 'bid',
                tags: product.tags,
                views: product.views,
                likes: product.likes,
                currentBid: product.currentBid,
                isAuction: product.isAuction,
                images: product.images,
                author,
                comments: formattedComments,
            };
        });

        // Pagination metadata
        const totalPages = Math.ceil(totalProducts / productsPerPage);

        return NextResponse.json({
            projects: formattedProducts,
            pagination: {
                currentPage: pageNumber,
                totalPages,
                totalProducts,
            },
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Error fetching products and comments:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500 }
        );
    }
}
