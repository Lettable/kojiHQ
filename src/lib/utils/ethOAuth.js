import axios from 'axios';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '7d';

export const handleMetaMaskAuth = async (username) => {
    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];

        // Connect to the database
        await connectDB();

        // Check if the user already exists
        let existingUser = await User.findOne({ walletAddress: userAddress });

        // Generate a nonce for signing
        const nonce = Math.floor(Math.random() * 1000000).toString(); // Simple nonce generation
        // Store the nonce in the user's record or session (for simplicity, we'll just log it here)
        console.log(`Nonce for ${userAddress}: ${nonce}`);

        if (!existingUser) {
            existingUser = new User({
                username: username,
                walletAddress: userAddress,
                nonce: nonce,
                profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2-flKQOIE8ribInudJWpIsy94v1B7LMCemuBf8RcjpIY1Pt3hLHZR5r78rXBFW0cIhVg&usqp=CAU'
            });

            await existingUser.save();
        } else {
            existingUser.nonce = nonce;
            await existingUser.save();
        }

        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [userAddress, nonce],
        });

        const recoveredAddress = await verifySignature(nonce, signature);
        if (recoveredAddress.toLowerCase() !== userAddress.toLowerCase()) {
            throw new Error('Signature verification failed');
        }

        const token = jwt.sign(
            {
                userId: existingUser._id,
                username: existingUser.username,
                nonce: nonce,
                walletAddress: existingUser.walletAddress,
                profilePic: existingUser.profilePic,
            },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        return NextResponse.redirect(`https://koji.cbu.net/welcome?token=${token}`, { status: 302 });
        // return { token, user: existingUser };
    } catch (error) {
        console.error('Error during MetaMask authentication:', error);
        throw new Error('MetaMask authentication failed');
    }
};

export const verifySignature = async (nonce, signature) => {
    const message = `Sign this message to log in: ${nonce}`;
    const recoveredAddress = await window.ethereum.request({
        method: 'personal_ecRecover',
        params: [message, signature],
    });
    return recoveredAddress;
};