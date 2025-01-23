// import mongoose from 'mongoose';
// import { connectDB } from "../config/db";

// const ForumSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   description: {
//     type: String,
//     trim: true,
//   },
//   category: {
//     type: String,
//     required: true,
//     enum: ['Technology', 'Gaming', 'Education', 'Lifestyle', 'General', 'Marketplace', 'Community', 'Support'],
//     default: 'General',
//   },
//   catogIndex: {
//     type: Number,
//     required: true,
//   },
//   forumIndex: {
//     type: Number,
//     required: true
//   },
//   isClosed: {
//     type: Boolean,
//     default: false,
//   },
//   closedUntill: {
//     type: Date,
//     default: null
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const connection = await connectDB();
// export default connection.models.Forum || connection.model('Forum', ForumSchema);

import mongoose from "mongoose";

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
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true, // Links to the parent subcategory
  },
  index: {
    type: Number,
    required: true, // Determines placement within the subcategory
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
  closedUntil: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Forum = mongoose.models.Forum || mongoose.model('Forum', ForumSchema);
export default Forum;
