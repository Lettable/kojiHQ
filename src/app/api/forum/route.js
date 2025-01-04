import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import Forum from '@/lib/model/Forum.model.js';
import { verifyToken } from '@/lib/utils/auth/Token';
import { headers } from "next/headers";

export async function POST(req) {
    await connectDB();

    const headersList = await headers();
    const token = headersList.get("x-auth-token");

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { name, description, category } = await req.json();

    try {
        const newForum = new Forum({
            name: name,
            description: description,
            category: category
        });

        const savedForum = await newForum.save();
        return NextResponse.json(savedForum, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

export async function GET(req) {
    await connectDB();

    const forumId = req.nextUrl.searchParams.get('forumId');
    const category = req.nextUrl.searchParams.get('category');

    try {
        let forums;
        if (forumId) {
            forums = await Forum.findById(forumId);
        } else if (category) {
            forums = await Forum.find({ category });
        } else {
            forums = await Forum.find();
        }

        return NextResponse.json(forums, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}