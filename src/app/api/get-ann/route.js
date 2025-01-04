import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import AnnouncementModel from '@/lib/model/Announcement.model';

export async function GET() {
    try {
        await connectDB();
        const announcements = await AnnouncementModel.find({}).sort({ createdAt: -1 });
        
        return NextResponse.json(
            { announcements },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch announcements' },
            { status: 500 }
        );
    }
}