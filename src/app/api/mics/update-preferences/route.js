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
const ALLOWED_PARAMS = [
    "favYtVideo",
    "telegramId",
    "discordId",
    "usernameEffect",
    "btcAddress"
];

export async function POST(req) {
    const token = req.nextUrl.searchParams.get('token');

    try {
        await connectDB();
        const updatedData = await req.json();

        const filteredData = {};
        ALLOWED_PARAMS.forEach(param => {
            if (updatedData[param] !== undefined) {
                filteredData[param] = updatedData[param];
            }
        });

        if (Object.keys(filteredData).length === 0) {
            console.log('filtered Data', filteredData)
            return NextResponse.json(
                { error: "No valid fields to update" },
                { status: 400 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: filteredData },
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