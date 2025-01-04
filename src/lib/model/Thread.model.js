import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    forumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
    title: {
      type: String,
      trim: true,
      required: true,
      default: '',
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    repliesCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'closed', 'deleted'],
      default: 'active',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    attachments: [
      {
        fileName: { type: String, trim: true },
        fileUrl: {
          type: String,
          validate: {
            validator: function (v) {
              return /^https?:\/\/[^\s$.?#].[^\s]*$/.test(v);
            },
            message: 'Invalid URL format for attachment',
          },
        },
        extention: { type: String, trim: true },
        size: { type: Number },
        fileType: { type: String, trim: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Thread || mongoose.model('Thread', threadSchema);
