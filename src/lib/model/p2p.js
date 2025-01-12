// import mongoose from "mongoose";

// const P2pSchema = new mongoose.Schema({
//   senderId: { type: String, required: true },
//   recipientId: { type: String, required: true },
//   content: { type: String, required: true },
//   read: { type: Boolean, default: false },
//   timestamp: { type: Date, default: Date.now },
// });

// const P2PMessage = connection.models.P2PMessage || connection.model("P2PMessage", P2pSchema);
// export default P2PMessage;


import mongoose from "mongoose";
import { connectDB } from "../config/db";
const connection = await connectDB();

const P2pSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "P2PMessage",
    default: null,
  },
});

const P2PMessage = connection.models.P2PMessage || connection.model("P2PMessage", P2pSchema);
export default P2PMessage;
