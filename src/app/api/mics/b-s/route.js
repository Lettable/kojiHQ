// Note: This is a route file for the site config API
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import SiteConfig from '@/lib/model/Config.model';
import User from '@/lib/model/User.model';

export async function POST(req) {
  try {
    const { uid } = await req.json();
    if (!uid) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ userId: uid });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const config = await SiteConfig.findOne({});
    if (!config) {
      return NextResponse.json({ success: false, message: 'Config not found' }, { status: 404 });
    }

    if (user.isAdmin) {
      return NextResponse.json({
        success: true,
        config: {
          status: 'open',
          message: 'Site is open (Admin override)',
        },
      });
    }

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Site config error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
