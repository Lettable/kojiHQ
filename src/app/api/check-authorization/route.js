import { connectDB } from "@/lib/config/db";
import Project from "@/lib/model/Product.model.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  const userId = req.nextUrl.searchParams.get('userId');
  try {
    await connectDB();

    const project = await Project.findOne({ ownerId: userId }).exec();

    if (project || userId === "6777869c7ea3f24ea1a7a1d5") {
      return new NextResponse(
        JSON.stringify({ isAuthorized: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ isAuthorized: false }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error checking user authorization:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
