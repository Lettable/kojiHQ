import mongoose from 'mongoose';
import { connectDB } from "../config/db";
const connection = await connectDB();

// const UserSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   usernameEffect: {
//     type: String,
//     unique: false,
//     default: "regular-effect"
//   },
//   storedUsernameEffects: {
//     type: Array,
//     default: ["regular-effect"]
//   },
//   favYtVideo: {
//     type: String,
//     default: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//     required: false
//   },
//   statusEmoji: {
//     type: String,
//     default: null
//   },
//   lastUsernameChange: {
//     type: Date,
//     default: null
//   },
//   lastPfpChange: {
//     type: Date,
//     default: null
//   },
//   signature: {
//     type: String,
//     defualt: "",
//     required: false
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   passwordHash: {
//     type: String,
//     required: function () {
//       return !this.discordId;
//     },
//   },
//   telegramUID: {
//     type: String,
//     required: false,
//     unique: true,
//     trim: true
//   },
//   profilePic: {
//     type: String,
//     default: null,
//   },
//   bio: {
//     type: String,
//     trim: true,
//     default: 'Edit your bio...',
//   },
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
//   intractedWith: {
//     type: [mongoose.Schema.Types.ObjectId],
//     ref: 'User',
//     default: [],
//   },
//   blockedUsers: {
//     type: [mongoose.Schema.Types.ObjectId],
//     ref: 'User',
//     default: [],
//   },
//   isAdmin: {
//     type: Boolean,
//     default: false,
//   },
//   isBanned: {
//     type: Boolean,
//     default: false,
//   },
//   isSuspended: {
//     type: Boolean,
//     default: false,
//   },
//   suspendedUntil: {
//     type: Date,
//     default: null,
//   },
//   groups: {
//     type: [
//       {
//         groupName: { type: String, required: true },
//       },
//     ],
//     default: [
//       { 
//         groupName: 'Member'
//       },
//     ],
//   },
//   reputationGiven: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//   ],
//   reputationTaken: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//   ],
//   savedThreads: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Thread',
//     },
//   ],
//   savePost: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Post',
//     },
//   ],
//   discordId: {
//     type: String,
//     default: null,
//   },
//   discordAccessToken: {
//     type: String,
//     default: null,
//   },
//   discordRefreshToken: {
//     type: String,
//     default: null,
//   },
//   discordTokenExpiresAt: {
//     type: Date,
//     default: null,
//   },
//   isPremium: {
//     type: Boolean,
//     default: false,
//   },
//   planName: {
//     type: String,
//     default: null,
//     enum: ["weekly", "monthly", "yearly"]
//   },
//   premiumEndDate: {
//     type: Date,
//     default: null,
//   },
//   lastLogin: {
//     type: Date,
//     default: Date.now,
//   },
//   totalSpent: {
//     type: Number,
//     default: 0,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const User = connection.models.User || connection.model('User', UserSchema);
// export default User;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  usernameEffect: {
    type: String,
    unique: false,
    default: "regular-effect"
  },
  storedUsernameEffects: {
    type: Array,
    default: ["regular-effect"]
  },
  favYtVideo: {
    type: String,
    default: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    required: false
  },
  statusEmoji: {
    type: String,
    default: null
  },
  lastUsernameChange: {
    type: Date,
    default: null
  },
  bannerImg: {
    type: String,
    default: ""
  },
  favSpotifyTrack: {
    type: String,
    default: ""
  },
  lastPfpChange: {
    type: Date,
    default: null
  },
  signature: {
    type: String,
    default: "",
    required: false
  },
  email: {
    type: String,
    required: function () {
      return !this.walletAddress && !this.discordId;
    },
    unique: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: function () {
      return !this.walletAddress && !this.discordId;
    },
  },
  latestVisitors: [
    {
      visitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      visitedAt: { type: Date, default: Date.now }
    }
  ],
  currentlyAt: {
    type: String,
    required: false
  },
  telegramUID: {
    type: String,
    required: false,
    unique: true,
    trim: true
  },
  profilePic: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    trim: true,
    default: 'Edit your bio...',
  },
  credits: {
    type: Number,
    default: 50
  },
  btcAddress: {
    type: String,
    default: "",
    required: false
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  intractedWith: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  blockedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  suspendedUntil: {
    type: Date,
    default: null,
  },
  groups: {
    type: [
      {
        groupName: { type: String, required: true },
      },
    ],
    default: [
      { 
        groupName: 'Member'
      },
    ],
  },
  reputationGiven: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  reputationTaken: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  savedThreads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread',
    },
  ],
  savePost: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  discordId: {
    type: String,
    default: null,
  },
  discordAccessToken: {
    type: String,
    default: null,
  },
  discordRefreshToken: {
    type: String,
    default: null,
  },
  discordTokenExpiresAt: {
    type: Date,
    default: null,
  },
  walletAddress: {
    type: String,
    unique: true,
    required: false,
  },
  nonce: {
    type: Number,
    default: 0,
    required: function() {
      return !this.discordId;
    }
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  planName: {
    type: String,
    default: null,
    enum: ["Weekly", "Monthly", "Yearly"]
  },
  premiumEndDate: {
    type: Date,
    default: null,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = connection.models.User || connection.model('User', UserSchema);
export default User;