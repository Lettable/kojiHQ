import User from "@/lib/model/User.model";
import { connectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const users = await User.find({}, 'username usernameEffect');
    
    return NextResponse.json(
      { data: users },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}