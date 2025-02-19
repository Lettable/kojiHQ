// import { connectDB } from "@/lib/config/db";
// import Project from "@/lib/model/Product.model.js";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   const userId = req.nextUrl.searchParams.get('userId');
//   try {
//     await connectDB();

//     const project = await Project.findOne({ ownerId: userId }).exec();

//     if (project || userId === "6777869c7ea3f24ea1a7a1d5") {
//       return new NextResponse(
//         JSON.stringify({ isAuthorized: true }),
//         { status: 200, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     return new NextResponse(
//       JSON.stringify({ isAuthorized: false }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );

//   } catch (error) {
//     console.error("Error checking user authorization:", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Internal Server Error" }),
//       { status: 500 }
//     );
//   }
// }


// import { connectDB } from "@/lib/config/db";
// import User from "@/lib/model/User.model.js";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   const userId = req.nextUrl.searchParams.get("userId");

//   try {
//     await connectDB();

//     const user = await User.findOne({ userId }).exec();
//     if (!user) {
//       return new NextResponse(
//         JSON.stringify({ isAuthorized: false, reason: "User not found" }),
//         { status: 403 }
//       );
//     }

//     const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
//     const recentBannedUser = await User.findOne({
//       isBanned: true,
//       bannedAt: { $gte: thirtyMinutesAgo },
//     });

//     const isSuspicious =
//       recentBannedUser &&
//       (user.username.includes(recentBannedUser.username) ||
//         user.ip === recentBannedUser.ip);

//     if (isSuspicious) {
//       return new NextResponse(
//         JSON.stringify({
//           isAuthorized: false,
//           reason: "Suspicious activity detected",
//         }),
//         { status: 403 }
//       );
//     }

//     return new NextResponse(
//       JSON.stringify({ isAuthorized: true }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error checking user authorization:", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Internal Server Error" }),
//       { status: 500 }
//     );
//   }
// }


import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  const userId = req.nextUrl.searchParams.get("userId");

  try {
    await connectDB();

    const user = await User.findOne({ userId }).exec();
    if (!user) {
      return new NextResponse(
        JSON.stringify({ isAuthorized: false, reason: "User not found" }),
        { status: 403 }
      );
    }

    if (user.isAdmin) {
      return new NextResponse(
        JSON.stringify({ isAuthorized: true }),
        { status: 200 }
      );
    } else {
      return new NextResponse(
        JSON.stringify({ isAuthorized: false, reason: "Not an admin" }),
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Error checking user authorization:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}