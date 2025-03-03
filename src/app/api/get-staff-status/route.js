// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/config/db';
// import Staff from '@/lib/model/staff.model';
// import User from '@/lib/model/User.model';

// export async function GET() {
//     try {
//         await connectDB();

//         const staffMembers = await Staff.find({});
//         if (!staffMembers || staffMembers.length === 0) {
//             return NextResponse.json(
//                 { success: false, error: 'No staff members found' },
//                 { status: 404 }
//             );
//         }
        
//         const userIds = staffMembers.map(staff => staff.userId);
//         const users = await User.find({ _id: { $in: userIds } }).lean();
//         if (!users || users.length === 0) {
//             return NextResponse.json({ success: true, data: [] });
//         }
//         const userMap = new Map(users.map(user => [user._id.toString(), user]));
//         const staffData = staffMembers.map(staff => {
//             const user = userMap.get(staff.userId);
//             if (!user) return null;

//             return {
//                 username: user.username,
//                 userId: staff.userId,
//                 usernameEffect: user.usernameEffect ? user.usernameEffect : "regular-effect",
//                 statusEmoji: user.statusEmoji,
//                 status: staff.status
//             };
//         }).filter(Boolean);

//         return NextResponse.json({ 
//             success: true, 
//             data: staffData 
//         });

//     } catch (error) {
//         console.error('Error fetching staff status:', error);
//         return NextResponse.json(
//             { success: false, error: 'Failed to fetch staff status' },
//             { status: 500 }
//         );
//     }
// }


import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';
import Message from '@/lib/model/Message';

export async function GET() {
  try {
    await connectDB();

    const adminUsers = await User.find({ isAdmin: true }).lean();
    if (!adminUsers || adminUsers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No admin users found' },
        { status: 404 }
      );
    }

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const staffData = await Promise.all(
      adminUsers.map(async (user) => {
        const latestMessage = await Message.findOne({ userId: user._id.toString() })
          .sort({ createdAt: -1 })
          .lean();
        
        const isOnline = latestMessage && new Date(latestMessage.createdAt) >= fifteenMinutesAgo;

        return {
          username: user.username,
          userId: user._id.toString(),
          usernameEffect: user.usernameEffect || 'regular-effect',
          statusEmoji: user.statusEmoji,
          status: isOnline ? 'online' : 'offline',
        };
      })
    );

    return NextResponse.json({ success: true, data: staffData });
  } catch (error) {
    console.error('Error fetching admin status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin status' },
      { status: 500 }
    );
  }
}