import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  statusEmoji: {
    type: String,
    default: null
  },
  lastUsernameChange: {
    type: Date,
    default: null
  },
  lastPfpChange: {
    type: Date,
    default: null
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: function () {
      return !this.discordId;
    },
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
  isPremium: {
    type: Boolean,
    default: false,
  },
  planName: {
    type: String,
    default: null,
    enum: ["weekly", "monthly", "yearly"]
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

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
