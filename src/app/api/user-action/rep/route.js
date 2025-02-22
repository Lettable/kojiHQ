import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';
import { NextResponse } from 'next/server';

const isObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

export async function POST(req) {
    await connectDB();

    const { userGiving, userToGiveRep, message } = await req.json();

    if (!userGiving || !userToGiveRep) {
        return NextResponse.json({ message: 'Both userGiving and userToGiveRep are required' }, { status: 400 });
    }

    try {
        const userGivingDoc = await User.findById(userGiving);
        
        if (!userGivingDoc) {
            return NextResponse.json({ message: 'User giving rep not found' }, { status: 404 });
        }

        let userToGiveRepDoc;
        if (isObjectId(userToGiveRep)) {
            userToGiveRepDoc = await User.findById(userToGiveRep);
        } else {
            userToGiveRepDoc = await User.findOne({ username: { $regex: `^${userToGiveRep}$`, $options: "i" }});
        }

        if (!userToGiveRepDoc) {
            return NextResponse.json({ message: 'User to give rep not found' }, { status: 404 });
        }

        const hasGivenRep = userGivingDoc.reputationGiven.some(rep => 
            rep.user && rep.user.toString() === userToGiveRepDoc._id.toString()
        );

        if (hasGivenRep) {
            userGivingDoc.reputationGiven = userGivingDoc.reputationGiven.filter(rep => 
                !rep.user || rep.user.toString() !== userToGiveRepDoc._id.toString()
            );
            userToGiveRepDoc.reputationTaken = userToGiveRepDoc.reputationTaken.filter(rep => 
                !rep.user || rep.user.toString() !== userGiving.toString()
            );
        } else {
            const repData = {
                user: userToGiveRepDoc._id,
                message: message || '',
                date: new Date()
            };
            
            const repTakenData = {
                user: userGiving,
                message: message || '',
                date: new Date()
            };

            userGivingDoc.reputationGiven.push(repData);
            userToGiveRepDoc.reputationTaken.push(repTakenData);
        }

        await userGivingDoc.save();
        await userToGiveRepDoc.save();

        return NextResponse.json({
            success: true,
            message: hasGivenRep ? 'Reputation removed successfully' : 'Reputation given successfully',
            hasGivenRep: !hasGivenRep,
        }, { status: 200 });
    } catch (error) {
        console.error('Error in giving/removing rep:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
