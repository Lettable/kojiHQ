import mongoose from 'mongoose';
import { connectDB } from "../config/db";

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

const connection = await connectDB();
export default connection.models.Forum || connection.model('Forum', ForumSchema);
