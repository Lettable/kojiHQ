// import { handleMetaMaskAuth } from "@/lib/utils/ethOAuth";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { username } = await req.json();

//     await handleMetaMaskAuth(username);

//     return NextResponse.json({
//         message: 'Successfully authenticated with MetaMask',
//         success: 'true',
//         fuckFBI: '!false',
//         longLiveKoji: 'true'
//     }, { status: 200 });
//   } catch (error) {
//     console.error('Error in MetaMask API route:', error);
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }

import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '7d';

export async function POST(req) {
  try {
    const { username, walletAddress, nonce, signature } = await req.json();

    await connectDB();

    let user = await User.findOne({ walletAddress });

    if (!user) {
      user = new User({
        username,
        walletAddress,
        nonce,
        profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2-flKQOIE8ribInudJWpIsy94v1B7LMCemuBf8RcjpIY1Pt3hLHZR5r78rXBFW0cIhVg&usqp=CAU',
      });
    } else {
      user.nonce = nonce;
    }

    console.log('Username', username, 'Wallet', walletAddress, 'Nonce', nonce, 'Sign', signature);

    await user.save();

    // const message = `Sign this message to log in: ${nonce}`;
    // const recoveredAddress = recoverSignature(message, signature);

    // if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    //   throw new Error('Signature verification failed');
    // }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        walletAddress: user.walletAddress,
        profilePic: user.profilePic,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    return NextResponse.json({ token, user }, { status: 200 });
  } catch (error) {
    console.error('Error in MetaMask authentication route:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// function recoverSignature(message, signature) {
//   const messageHash = ethers.utils.hashMessage(message);
//   const recoveredAddress = ethers.utils.recoverAddress(messageHash, signature);
//   return recoveredAddress;
// }
