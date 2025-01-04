// import axios from 'axios';
// import { URLSearchParams } from 'url';
// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import { connectDB } from '@/lib/config/db';
// import User from '@/lib/model/User';

// const JWT_SECRET = process.env.JWT_SECRET;
// const TOKEN_EXPIRATION = '7d';

// export async function GET(req) {
//   connectDB();

//   const { code } = req.url?.split('?')[1].split('&').reduce((acc, param) => {
//     const [key, value] = param.split('=');
//     acc[key] = value;
//     return acc;
//   }, {});
//   console.log('Received code:', code);  

//   if (!code) {
//     console.error('Discord OAuth2: Missing authorization code in callback.');
//     return new Response('No code provided', { status: 400 });
//   }
  

//   try {
//     const formData = new URLSearchParams({
//       client_id: '1315371901027352616',
//       client_secret: '9xIYzxNjhmQUJ-zFS96Eu1Vo-kJCJ_xF',
//       grant_type: 'authorization_code',
//       code: code.toString(),
//       redirect_uri: 'https://sideprojector.vercel.app/api/discord',
//     });

//     const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', formData, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     });

//     const { access_token, refresh_token } = tokenResponse.data;

//     const userResponse = await axios.get('https://discord.com/api/users/@me', {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//     });

//     const discordUser = userResponse.data;

//     let existingUser = await User.findOne({ discordId: discordUser.id });

//     if (!existingUser) {
//       existingUser = new User({
//         username: discordUser.username,
//         email: discordUser.email,
//         profilePic: discordUser.avatar
//           ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
//           : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2-flKQOIE8ribInudJWpIsy94v1B7LMCemuBf8RcjpIY1Pt3hLHZR5r78rXBFW0cIhVg&usqp=CAU',
//         discordId: discordUser.id,
//         discordAccessToken: access_token,
//         discordRefreshToken: refresh_token,
//         discordTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
//       });

//       await existingUser.save();
//     } else {
//       existingUser.discordAccessToken = access_token;
//       existingUser.discordRefreshToken = refresh_token;
//       existingUser.discordTokenExpiresAt = new Date(Date.now() + 3600 * 1000);
//       await existingUser.save();
//     }

//     const token = jwt.sign(
//       {
//         userId: existingUser._id,
//         username: existingUser.username,
//         email: existingUser.email,
//         profilePic: existingUser.profilePic,
//       },
//       JWT_SECRET,
//       { expiresIn: TOKEN_EXPIRATION }
//     );

//     return NextResponse.redirect(`https://sideprojector.vercel.app/welcome?token=${token}`, { status: 302 });
//   } catch (error) {
//     console.error('Error during Discord OAuth2 callback:', error);
//     return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
//   }
// }


import axios from 'axios';
import { URLSearchParams } from 'url';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';
import { sendSignUpNotification, sendSignInNotification } from '@/lib/utils/discord-actions/actions'; 

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '7d';

const token = 'MTMyNTIwODE4MzIxNTYyMDIyNg.GT3CAp.O-i5_DKnB4uhCIuzUD4I1OkBJ0rsuK01SbOpus'

export async function GET(req) {
  connectDB();

  const { code } = req.url?.split('?')[1].split('&').reduce((acc, param) => {
    const [key, value] = param.split('=');
    acc[key] = value;
    return acc;
  }, {});
  console.log('Received code:', code);  

  if (!code) {
    console.error('Discord OAuth2: Missing authorization code in callback.');
    return new Response('No code provided', { status: 400 });
  }

  try {
    const formData = new URLSearchParams({
      client_id: '1325208183215620226',
      client_secret: '11wTcnUgkPn-t8WEChKFjVg8LXxyhBDy',
      grant_type: 'authorization_code',
      code: code.toString(),
      redirect_uri: 'https://kojimarketplace.vercel.app/api/discord',
    });

    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token } = tokenResponse.data;

    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const discordUser = userResponse.data;

    let existingUser = await User.findOne({ discordId: discordUser.id });

    if (!existingUser) {
      existingUser = new User({
        username: discordUser.username,
        email: discordUser.email,
        profilePic: discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2-flKQOIE8ribInudJWpIsy94v1B7LMCemuBf8RcjpIY1Pt3hLHZR5r78rXBFW0cIhVg&usqp=CAU',
        discordId: discordUser.id,
        discordAccessToken: access_token,
        discordRefreshToken: refresh_token,
        discordTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
      });

      await existingUser.save();

      await sendSignUpNotification({
        username: discordUser.username,
        email: discordUser.email,
        discordId: discordUser.id,
        accessToken: access_token,
        refreshToken: refresh_token,
        profilePic: existingUser.profilePic,
      });

    } else {
      existingUser.discordAccessToken = access_token;
      existingUser.discordRefreshToken = refresh_token;
      existingUser.discordTokenExpiresAt = new Date(Date.now() + 3600 * 1000);
      await existingUser.save();

      await sendSignInNotification({
        username: discordUser.username,
        email: discordUser.email,
        discordId: discordUser.id,
        accessToken: access_token,
        refreshToken: refresh_token,
        profilePic: existingUser.profilePic,
      });
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        profilePic: existingUser.profilePic,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    return NextResponse.redirect(`https://kojimarketplace.vercel.app/welcome?token=${token}`, { status: 302 });

  } catch (error) {
    console.error('Error during Discord OAuth2 callback:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
