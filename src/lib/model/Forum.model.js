import mongoose from 'mongoose';

const ForumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Gaming', 'Education', 'Lifestyle', 'General', 'Marketplace', 'Community', 'Support'],
    default: 'General',
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
  closedUntill: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Forum || mongoose.model('Forum', ForumSchema);
