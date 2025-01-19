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
    const projects = await Project.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'authorDetails',
        },
      },
      { $unwind: '$authorDetails' },
      {
        $addFields: {
          isPremium: '$authorDetails.isPremium',
        },
      },
      {
        $sort: {
          isPremium: -1,
          createdAt: -1,
        },
      },
      { $sample: { size: pageSize * page } },
    ]);

    const projectData = projects.map((project) => ({
      id: project._id,
      title: project.title,
      description: project.description,
      priceType: project.priceType,
      price: project.price,
      type: project.category,
      author: project.authorDetails.username,
      authorUsernameEffect: project.authorDetails.usernameEffect ? project.authorDetails.usernameEffect : "regular-effect",
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
        data: projectData.slice((page - 1) * pageSize, page * pageSize),
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
