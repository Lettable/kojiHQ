// import { connectDB } from "@/lib/config/db";
// import User from "@/lib/model/User.model";
// import { NextResponse } from "next/server";
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET;

// export async function POST(req) {
//   const token = req.nextUrl.searchParams.get('token');

//   try {
//     await connectDB();
//     const updatedData = await req.json();

//     const decoded = jwt.verify(token, JWT_SECRET);
//     if (!decoded) {
//       return NextResponse.json(
//         { message: 'Invalid or expired token' },
//         { status: 401 }
//       );
//     }
//     const userId = decoded.userId

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $set: updatedData },
//       { new: true }
//     );

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Preferences updated successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Error updating preferences:", error);
//     return NextResponse.json(
//       { error: "Failed to update preferences" },
//       { status: 500 }
//     );
//   }
// }

import { connectDB } from "@/lib/config/db";
import User from "@/lib/model/User.model";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const token = req.nextUrl.searchParams.get('token');

  try {
    await connectDB();

    // Validate JSON request body
    const updatedData = await req.json();

    if (typeof updatedData !== 'object' || Array.isArray(updatedData)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    const allowedFields = ["usernameEffect", "btcAddress", "favYtVideo", "discordId", "telegramUID"];
    const sanitizedData = Object.keys(updatedData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updatedData[key];
        return obj;
      }, {});

    if (Object.keys(sanitizedData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: sanitizedData },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
