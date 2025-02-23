// Note: This is a route file for the site config API
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import SiteConfig from '@/lib/model/Config.model';
import User from '@/lib/model/User.model';

export async function POST(req) {
  try {
    const { uid } = await req.json();

    await connectDB();

    const config = await SiteConfig.findOne({});
    if (!config) {
      return NextResponse.json({ success: false, message: 'Config not found' }, { status: 404 });
    }

    if (uid) {
      const user = await User.findById(uid);
      if (user && user.isAdmin) {
        return NextResponse.json({
          success: true,
          config: {
            status: 'open',
            message: 'Site is open (Admin override)',
          },
        });
      }
    }

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Site config error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
