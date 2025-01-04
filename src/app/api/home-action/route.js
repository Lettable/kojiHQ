// import { connectDB } from '@/lib/config/db';
// import Project from '@/lib/model/Project';
// import User from '@/lib/model/User';
// import { NextResponse } from 'next/server';

// export async function GET(req) {
//     const page = parseInt(req.nextUrl.searchParams.get('page')) || 1;
//     const pageSize = 10;
//     await connectDB();

//     try {
//         const projects = await Project.find({})
//             .skip((page - 1) * pageSize)
//             .limit(pageSize)
//             .lean();

//         const projectData = await Promise.all(
//             projects.map(async (project) => {
//                 const author = await User.findById(project.ownerId).lean();

//                 return {
//                     id: project._id,
//                     title: project.title,
//                     description: project.description,
//                     priceType: project.priceType,
//                     price: project.price,
//                     type: project.category,
//                     author: author.username,
//                     authorId: author._id,
//                     profilePic: author.profilePic,
//                     views: project.views,
//                     date: project.createdAt,
//                     verified: author.verified,
//                     projectStatus: project.projectStatus
//                 };
//             })
//         );

//         return NextResponse.json(
//             {
//                 success: true,
//                 data: projectData,
//                 page,
//                 pageSize,
//             },
//             {
//                 status: 200,
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );
//     } catch (error) {
//         console.error('Error fetching projects:', error);
//         return NextResponse.json(
//             { success: false, error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }



// import { connectDB } from '@/lib/config/db';
// import Project from '@/lib/model/Project';
// import User from '@/lib/model/User';
// import { NextResponse } from 'next/server';

// export async function GET(req) {
//     const page = parseInt(req.nextUrl.searchParams.get('page')) || 1;
//     const pageSize = 10;
//     await connectDB();

//     try {
//         const projects = await Project.aggregate([
//             { $sample: { size: pageSize * page } }
//         ]);

//         const projectData = await Promise.all(
//             projects.map(async (project) => {
//                 const author = await User.findById(project.ownerId).lean();

//                 return {
//                     id: project._id,
//                     title: project.title,
//                     description: project.description,
//                     priceType: project.priceType,
//                     price: project.price,
//                     type: project.category,
//                     author: author.username,
//                     authorId: author._id,
//                     profilePic: author.profilePic,
//                     views: project.views,
//                     date: project.createdAt,
//                     verified: author.verified,
//                     projectStatus: project.projectStatus
//                 };
//             })
//         );

//         return NextResponse.json(
//             {
//                 success: true,
//                 data: projectData.slice((page - 1) * pageSize, page * pageSize),
//                 page,
//                 pageSize,
//             },
//             {
//                 status: 200,
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );
//     } catch (error) {
//         console.error('Error fetching projects:', error);
//         return NextResponse.json(
//             { success: false, error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }


import { connectDB } from '@/lib/config/db';
import Project from '@/lib/model/Product.model';
import User from '@/lib/model/User.model';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const page = parseInt(req.nextUrl.searchParams.get('page')) || 1;
  const pageSize = 10;
  await connectDB();

  try {
    // Fetch all projects and include the author's premium status
    const projects = await Project.aggregate([
      {
        $lookup: {
          from: 'users', // Match User collection
          localField: 'ownerId', // Link with the owner's ID
          foreignField: '_id', // Match against User ID
          as: 'authorDetails', // Alias for the joined user data
        },
      },
      { $unwind: '$authorDetails' }, // Flatten the author details array
      {
        $addFields: {
          isPremium: '$authorDetails.isPremium', // Add premium status
        },
      },
      {
        $sort: {
          isPremium: -1, // Sort by premium status first (1 = premium, 0 = non-premium)
          createdAt: -1, // Then sort by creation date (most recent first)
        },
      },
      { $sample: { size: pageSize * page } }, // Random sampling, maintaining premium priority
    ]);

    // Format the project data to include necessary fields
    const projectData = projects.map((project) => ({
      id: project._id,
      title: project.title,
      description: project.description,
      priceType: project.priceType,
      price: project.price,
      type: project.category,
      author: project.authorDetails.username,
      authorId: project.authorDetails._id,
      profilePic: project.authorDetails.profilePic,
      isPremium: project.isPremium,
      views: project.views,
      date: project.createdAt,
      verified: project.authorDetails.verified,
      projectStatus: project.projectStatus,
      authorStatusEmoji: project.authorDetails.statusEmoji,
    }));

    return NextResponse.json(
      {
        success: true,
        data: projectData.slice((page - 1) * pageSize, page * pageSize), // Paginate the results
        page,
        pageSize,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
