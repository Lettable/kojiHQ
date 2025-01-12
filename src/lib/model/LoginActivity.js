import mongoose from "mongoose";
import { connectDB } from "../config/db";

const connection = await connectDB();
const LoginActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  device: {
    type: Object,
  },
  loginDate: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true });

const LoginActivity =
  connection.models.LoginActivity ||
  connection.model("LoginActivity", LoginActivitySchema);

export default LoginActivity;
