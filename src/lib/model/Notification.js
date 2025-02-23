import mongoose from "mongoose";
import { connectDB } from "../config/db";
const connection = await connectDB();

const NotificationSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["productReply", "message", "mention", "rep"],
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId, ref: "Products",
    required: false
  },
  state: {
    type: String,
    enum: ["static", "dynamic"]
  },
  target: {
    type: String,
    default: ""
  },
  message: {
    type: String,
    default: "You received a new notification"
  },
  readed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default connection.models.Notification || connection.model("Notification", NotificationSchema);
