// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/config/db';  // MongoDB connection utility
// import Project from '@/lib/model/Project';  // Project model

// // Define weights for views and comments
// const WEIGHT_VIEWS = 0.5;
// const WEIGHT_COMMENTS = 1.5;

// export async function GET() {
//   try {
//     // Connect to MongoDB
//     await connectDB();

//     // Define aggregation pipeline
//     const aggregationPipeline = [
//       // Step 1: Join comments collection with the projects
//       {
//         $lookup: {
//           from: 'comments',  // Name of the comments collection
//           localField: '_id',  // _id from the projects collection
//           foreignField: 'projectId',  // projectId in the comments collection
//           as: 'comments',  // Joined field
//         },
//       },
//       // Step 2: Count total comments (including replies)
//       {
//         $addFields: {
//           totalComments: {
//             $sum: [
//               { $size: "$comments" },  // Count the number of comments
//               { $sum: { $map: { input: "$comments.replies", as: "reply", in: { $size: "$$reply" } } } }, // Count replies
//             ],
//           },
//         },
//       },
//       // Step 3: Calculate the score for each project based on views and comments
//       {
//         $addFields: {
//           score: {
//             $add: [
//               { $multiply: ["$views", WEIGHT_VIEWS] },  // Views weighted by 0.5
//               { $multiply: ["$totalComments", WEIGHT_COMMENTS] },  // Comments weighted by 1.5
//             ],
//           },
//         },
//       },
//       // Step 4: Sort projects by score in descending order
//       {
//         $sort: { score: -1 },
//       },
//       // Step 5: Limit the results to top 10 projects
//       {
//         $limit: 10,
//       },
//     ];

//     console.log(aggregationPipeline.length)

//     // Execute the aggregation query
//     const topProjects = await Project.aggregate(aggregationPipeline)

//     // Return the top 10 ranked projects
//     return NextResponse.json(topProjects);
//   } catch (error) {
//     console.error('Error fetching top projects:', error);
//     return NextResponse.json({ error: 'Error fetching top projects' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import Project from '@/lib/model/Product.model';

const WEIGHT_VIEWS = 0.5;
const WEIGHT_COMMENTS = 1.5;

export async function GET() {
  try {
    await connectDB();

    const aggregationPipeline = [
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'projectId',
          as: 'comments',
        },
      },
      {
        $addFields: {
          totalComments: {
            $sum: [
              { $size: "$comments" },
              { $sum: { $map: { input: "$comments.replies", as: "reply", in: { $size: "$$reply" } } } },
            ],
          },
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$views", WEIGHT_VIEWS] },
              { $multiply: ["$totalComments", WEIGHT_COMMENTS] },
            ],
          },
        },
      },
      {
        $sort: { score: -1 },
      },
      {
        $limit: 10,
      },
      {
        $setWindowFields: {
          sortBy: { score: -1 },
          output: {
            number: { $rank: {} },
          },
        },
      },
      {
        $project: {
          title: 1,
          description: {
            $cond: {
              if: { $gt: [{ $strLenCP: "$description" }, 300] },
              then: { $concat: [{ $substrCP: ["$description", 0, 300] }, "..."] },
              else: "$description",
            },
          },
          tags: 1,
          number: 1,
        },
      },
    ];

    const topProjects = await Project.aggregate(aggregationPipeline);

    return NextResponse.json(topProjects);
  } catch (error) {
    console.error('Error fetching top projects:', error);
    return NextResponse.json({ error: 'Error fetching top projects' }, { status: 500 });
  }
}
