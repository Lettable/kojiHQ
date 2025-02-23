import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';
import { NextResponse } from 'next/server';

const isObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

export async function POST(req) {
    await connectDB();

    const { userGiving, userToGiveRep, message, type } = await req.json();

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

        if (!userGivingDoc.reputationGiven) userGivingDoc.reputationGiven = [];
        if (!userToGiveRepDoc.reputationTaken) userToGiveRepDoc.reputationTaken = [];

        const existingGivenRep = userGivingDoc.reputationGiven.find(
            rep => rep.userId && rep.userId.toString() === userToGiveRepDoc._id.toString()
        );

        const existingTakenRep = userToGiveRepDoc.reputationTaken.find(
            rep => rep.userId && rep.userId.toString() === userGivingDoc._id.toString()
        );

        if (existingGivenRep) {
            userGivingDoc.reputationGiven = userGivingDoc.reputationGiven.filter(
                rep => rep.userId && rep.userId.toString() !== userToGiveRepDoc._id.toString()
            );
            userToGiveRepDoc.reputationTaken = userToGiveRepDoc.reputationTaken.filter(
                rep => rep.userId && rep.userId.toString() !== userGivingDoc._id.toString()
            );
        } else {
            const newRep = {
                userId: userToGiveRepDoc._id,
                message: message || '',
                type: type || 'positive',
                givenAt: new Date()
            };

            const newTakenRep = {
                userId: userGivingDoc._id,
                message: message || '',
                type: type || 'positive',
                givenAt: new Date()
            };

            userGivingDoc.reputationGiven.push(newRep);
            userToGiveRepDoc.reputationTaken.push(newTakenRep);
        }

        await userGivingDoc.save();
        await userToGiveRepDoc.save();

        return NextResponse.json({
            success: true,
            message: existingGivenRep ? 'Reputation removed successfully' : 'Reputation given successfully',
            hasGivenRep: !existingGivenRep,
        }, { status: 200 });
    } catch (error) {
        console.error('Error in giving/removing rep:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
