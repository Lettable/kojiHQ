import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    threadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread',
      required: true,
      default: null,
    },
    replyPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: false,
        default: null,
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
    repliesCount: {
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Post || mongoose.model('Post', postSchema);
